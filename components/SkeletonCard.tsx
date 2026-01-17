export function SkeletonCard() {
  return (
    <div className="card">
      <div className="card-section space-y-4">
        <div className="skeleton h-5 w-1/2" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-2/3" />
        </div>
        <div className="skeleton h-8 w-32" />
      </div>
    </div>
  );
}
