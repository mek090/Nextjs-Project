import { Skeleton } from "@/components/ui/skeleton"

const loading = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Skeleton className="h-12 w-1/4 rounded-md" />
        <Skeleton className="h-3 w-28 rounded-md" />
        <Skeleton className="h-7 w-1/4 rounded-md" />
       

      </div>



      <div className="flex flex-wrap gap-6 justify-center mt-8">



        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-[300px] rounded-xl shadow-md bg-white p-4 flex flex-col"
          >
            {/* รูปภาพ */}
            <Skeleton className="w-full h-[180px] rounded-md mb-4" />

            {/* ป้ายราคา/ฟรี */}
            <Skeleton className="w-16 h-5 rounded-md mb-2" />

            {/* ชื่อสถานที่ */}
            <Skeleton className="w-2/3 h-6 rounded-md mb-2" />

            {/* คำอธิบายย่อ */}
            <Skeleton className="w-full h-4 rounded mb-1" />
            <Skeleton className="w-5/6 h-4 rounded mb-4" />

            {/* ไอคอนที่อยู่ */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-1/4 h-4 rounded" />
            </div>

            {/* ปุ่ม "ดูรายละเอียด" */}
            <Skeleton className="h-10 w-full rounded-md mb-4" />

            {/* ปุ่ม action ด้านล่าง */}
            <div className="flex justify-between">
              {[...Array(4)].map((_, idx) => (
                <Skeleton key={idx} className="w-8 h-8 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default loading
