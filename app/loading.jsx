export default function LoadingUtama() {
  return (
    <div className="py-6 space-y-8 animate-pulse">
      {/* Banner / Header Skeleton */}
      <div className="flex flex-col gap-3">
        <div className="h-8 bg-garis/60 rounded-lg w-48"></div>
        <div className="h-4 bg-garis/40 rounded w-72"></div>
      </div>

      {/* Filter & Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-permukaan p-4 rounded-xl border border-garis/50">
        <div className="h-10 bg-garis/50 rounded-lg w-full sm:w-64"></div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="h-10 bg-garis/50 rounded-lg w-28"></div>
          <div className="h-10 bg-garis/50 rounded-lg w-28"></div>
        </div>
      </div>

      {/* Grid Produk Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl overflow-hidden border border-garis/60 bg-permukaan p-3 space-y-3"
          >
            {/* Foto Skeleton */}
            <div className="aspect-square w-full rounded-lg bg-garis/50"></div>
            {/* Kategori */}
            <div className="h-3 bg-garis/40 rounded w-16"></div>
            {/* Judul */}
            <div className="h-4 bg-garis/60 rounded w-3/4"></div>
            {/* Harga */}
            <div className="h-5 bg-garis/70 rounded w-1/2"></div>
            {/* Tombol aksi */}
            <div className="h-9 bg-garis/40 rounded-lg w-full mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
