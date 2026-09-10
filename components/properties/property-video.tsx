export function PropertyVideo({
  videoUrl,
  title,
}: {
  videoUrl: string;
  title: string;
}) {
  return (
    <div className="property-copy property-video">
      <h2>Vídeo do imóvel</h2>
      <video
        className="property-video__player"
        src={videoUrl}
        controls
        preload="metadata"
        aria-label={`Vídeo de apresentação de ${title}`}
      />
    </div>
  );
}
