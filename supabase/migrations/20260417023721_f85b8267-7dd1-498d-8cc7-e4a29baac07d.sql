
-- Add photos column to notes table
ALTER TABLE public.notes ADD COLUMN photos TEXT[] NOT NULL DEFAULT '{}';

-- Create storage bucket for note photos
INSERT INTO storage.buckets (id, name, public) VALUES ('note-photos', 'note-photos', true);

-- Storage policies: users can manage photos in their own folder (folder name = user_id)
CREATE POLICY "Users can view note photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'note-photos');

CREATE POLICY "Users can upload their own note photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'note-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own note photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'note-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own note photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'note-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
