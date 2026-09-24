import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, created, fail, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';

const MAX_CV_BYTES = 5 * 1024 * 1024;
const ALLOWED = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

/** GET /api/applications — staff only */
export async function GET() {
  try {
    await requireRole(['admin', 'editor']);
    const { data, error } = await createAdminClient()
      .from('applications')
      .select('*, job:jobs(slug, title_en, title_ar)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return ok(data ?? []);
  } catch (e) { return handle(e); }
}

/**
 * POST /api/applications — public, multipart.
 * Fields: job_slug, full_name, email, phone, location, linkedin,
 *         years_experience, current_position, notice_period, expected_salary,
 *         notes, cv (File)
 * The CV lands in the private "cvs" bucket; only staff can read it back.
 */
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const get = (k: string) => {
      const v = form.get(k);
      return typeof v === 'string' && v.trim() ? v.trim() : null;
    };

    const full_name = get('full_name');
    const email = get('email');
    const phone = get('phone');
    if (!full_name || !email || !phone) return fail('Name, email and phone are required', 422);
    if (!/.+@.+\..+/.test(email)) return fail('Valid email required', 422);

    const admin = createAdminClient();
    const job_slug = get('job_slug');

    let job_id: string | null = null;
    if (job_slug) {
      const { data: job } = await admin.from('jobs').select('id').eq('slug', job_slug).maybeSingle();
      job_id = job?.id ?? null;
    }

    let cv_url: string | null = null;
    let cv_name: string | null = null;
    const cv = form.get('cv');
    if (cv instanceof File && cv.size > 0) {
      if (cv.size > MAX_CV_BYTES) return fail('CV must be 5 MB or smaller', 413);
      if (!ALLOWED.includes(cv.type)) return fail('CV must be a PDF or Word document', 415);
      const ext = cv.name.split('.').pop() || 'pdf';
      const path = (job_slug || 'general') + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
      const { error: upErr } = await admin.storage.from('cvs').upload(path, cv, { contentType: cv.type, upsert: false });
      if (upErr) throw upErr;
      cv_url = path;          // private path — staff fetch a signed URL
      cv_name = cv.name;
    }

    const { data, error } = await createClient().from('applications').insert({
      job_id, job_slug,
      full_name, email, phone,
      location: get('location'),
      linkedin: get('linkedin'),
      years_experience: get('years_experience') ? Number(get('years_experience')) : null,
      current_position: get('current_position'),
      notice_period: get('notice_period'),
      expected_salary: get('expected_salary'),
      notes: get('notes'),
      cv_url, cv_name,
    }).select().single();
    if (error) throw error;

    return created({ id: data.id });
  } catch (e) { return handle(e); }
}
