
-- Make bucket private
UPDATE storage.buckets SET public = false WHERE id = 'note-photos';

-- Replace the broad SELECT policy with an owner-only one
DROP POLICY IF EXISTS "Users can view note photos" ON storage.objects;

CREATE POLICY "Users can view their own note photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'note-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
