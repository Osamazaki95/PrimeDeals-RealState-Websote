import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/supabase/guard';
import { ok, fail, handle } from '@/lib/api';

export const dynamic = 'force-dynamic';

/** POST /api/upload — multipart image upload into the public "media" bucket */
export async function POST(req: Request) {
  try {
    await requireRole(['admin', 'editor', 'agent']);
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return fail('No file provided', 422);

    const folder = String(form.get('folder') || 'uploads');
    const ext = file.name.split('.').pop() || 'jpg';
    const path = folder + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;

    const admin = createAdminClient();
    const { error } = await admin.storage.from('media').upload(path, file, {
      contentType: file.type, upsert: false,
    });
    if (error) throw error;

    const { data } = admin.storage.from('media').getPublicUrl(path);
    return ok({ path, url: data.publicUrl });
  } catch (e) { return handle(e); }
}
