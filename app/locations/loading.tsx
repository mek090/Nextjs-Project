import { Skeleton } from "@/components/ui/skeleton"

const loading = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3 md:space-y-4 px-3 sm:px-4">
        <Skeleton className="h-6 sm:h-8 md:h-10 lg:h-12 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-md" />
        <Skeleton className="h-4 sm:h-5 md:h-6 lg:h-7 w-full sm:w-3/4 rounded-md mt-1.5 sm:mt-2 md:mt-3" />
        <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 flex-wrap">
          <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-18 lg:w-18 xl:h-20 xl:w-20 mt-3 sm:mt-4 md:mt-6 rounded-md" />
          <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-18 lg:w-18 xl:h-20 xl:w-20 mt-3 sm:mt-4 md:mt-6 rounded-md" />
          <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-18 lg:w-18 xl:h-20 xl:w-20 mt-3 sm:mt-4 md:mt-6 rounded-md" />
          <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-18 lg:w-18 xl:h-20 xl:w-20 mt-3 sm:mt-4 md:mt-6 rounded-md" />
          <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-18 lg:w-18 xl:h-20 xl:w-20 mt-3 sm:mt-4 md:mt-6 rounded-md" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-6 justify-center mt-4 sm:mt-6 md:mt-8 px-3 sm:px-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-full sm:w-[260px] md:w-[280px] lg:w-[300px] rounded-lg sm:rounded-xl shadow-md bg-white p-2.5 sm:p-3 md:p-4 flex flex-col"
          >
            {/* รูปภาพ */}
            <Skeleton className="w-full h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] rounded-md mb-2.5 sm:mb-3 md:mb-4" />

            {/* ป้ายราคา/ฟรี */}
            <Skeleton className="w-10 sm:w-12 md:w-14 lg:w-16 h-3.5 sm:h-4 md:h-5 rounded-md mb-1.5 sm:mb-2" />

            {/* ชื่อสถานที่ */}
            <Skeleton className="w-2/3 h-4 sm:h-5 md:h-6 rounded-md mb-1.5 sm:mb-2" />

            {/* คำอธิบายย่อ */}
            <Skeleton className="w-full h-2.5 sm:h-3 md:h-4 rounded mb-0.5 sm:mb-1" />
            <Skeleton className="w-5/6 h-2.5 sm:h-3 md:h-4 rounded mb-2.5 sm:mb-3 md:mb-4" />

            {/* ไอคอนที่อยู่ */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3 md:mb-4">
              <Skeleton className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full" />
              <Skeleton className="w-1/4 h-2.5 sm:h-3 md:h-4 rounded" />
            </div>

            {/* ปุ่ม "ดูรายละเอียด" */}
            <Skeleton className="h-7 sm:h-8 md:h-9 lg:h-10 w-full rounded-md mb-2.5 sm:mb-3 md:mb-4" />

            {/* ปุ่ม action ด้านล่าง */}
            <div className="flex justify-between">
              {[...Array(4)].map((_, idx) => (
                <Skeleton key={idx} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default loading
