export default function LoadingDetailProduk() {
  return (
    <div className="py-8 animate-pulse space-y-6">
      {/* Tombol kembali skeleton */}
      <div className="h-5 bg-garis/50 rounded w-36"></div>

      {/* Grid foto dan detail skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Galeri Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-garis/60"></div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-lg bg-garis/40"></div>
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-garis/40 rounded w-24"></div>
          <div className="h-8 bg-garis/70 rounded w-3/4"></div>
          <div className="h-7 bg-garis/60 rounded w-1/3"></div>

          <div className="h-px bg-garis/50 my-4"></div>

          <div className="space-y-2">
            <div className="h-4 bg-garis/50 rounded w-full"></div>
            <div className="h-4 bg-garis/50 rounded w-5/6"></div>
            <div className="h-4 bg-garis/40 rounded w-4/6"></div>
          </div>

          <div className="pt-4 space-y-3">
            <div className="h-12 bg-garis/60 rounded-xl w-full"></div>
            <div className="h-12 bg-garis/40 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
