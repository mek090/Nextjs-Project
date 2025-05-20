import { createLocationAction } from "@/actions/actions"
import SubmitButton from "@/components/form/Button"
import CategoryInput from "@/components/form/CategoryInput"
import FormInput from "@/components/form/Form"
import FormContainer from "@/components/form/FormContainer"
import ProvincesInput from "@/components/form/DistrictsInput"
import TextareaInput from "@/components/form/TextareaInput"
import MapLocation from "@/components/map/MapLocation"
import ImageInput from "@/components/form/ImageInput"
import Breadcrumbs from "@/components/location/Breadcrumbs"

const CreateLocation = () => {
    return (<>
        <header className="m-4">
            <Breadcrumbs
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Manage Location', href: '/dashboard/managelocation' },
                    { label: 'Create Location' },
                ]}
            />
        </header>
        <section className="max-w-4xl mx-auto p-6 mt-8 border-2 shadow-lg rounded-xl">
            <div className="border-b pb-4 mb-6">
                <h1 className="text-3xl font-bold text-blue-800">
                    เพิ่มสถานที่ท่องเที่ยว
                </h1>
                <p className="text-gray-600 mt-2">กรอกข้อมูลสถานที่ท่องเที่ยวที่คุณต้องการ</p>
            </div>

            <FormContainer action={createLocationAction}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormInput
                        name="name"
                        label="ชื่อสถานที่"
                        type="text"
                        placeholder="ต้องไม่ต่ำกว่า 2 ตัวอักษร"
                    />
                    <CategoryInput />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                        <FormInput
                            name="price"
                            label="ราคาค่าใช้จ่าย (บาท)"
                            type="text"
                            placeholder="เช่น ฟรี, 0-100, ติดต่อสอบถาม"
                        />
                        <p className="text-sm text-gray-500">ระบุราคา เช่น "ฟรี", "0-100 บาท", "ติดต่อสอบถาม"</p>
                    </div>
                    <ProvincesInput />
                </div>

                <div className="mb-6">
                    <TextareaInput
                        name="description"
                        LabelText="รายละเอียดสถานที่"
                    />
                </div>

                <div className="mb-8 p-4 border-2 rounded-lg">
                    <h2 className="text-xl font-semibold text-blue-800 mb-4">รูปภาพสถานที่</h2>
                    <p className="text-sm text-gray-600 mb-3">อัพโหลดรูปภาพสถานที่ท่องเที่ยว</p>
                    <ImageInput />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormInput
                        name="openTime"
                        label="เวลาเปิด (ไม่จำเป็น)"
                        type="time"
                    />

                    <FormInput
                        name="closeTime"
                        label="เวลาปิด (ไม่จำเป็น)"
                        type="time"
                    />

                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-blue-800 mb-4">ตำแหน่งที่ตั้ง</h2>
                    <p className="text-sm text-gray-600 mb-3">คลิกบนแผนที่เพื่อระบุตำแหน่งที่ตั้งที่แน่นอน</p>
                    <MapLocation />
                </div>

                <div className="mt-8 text-center">
                    <SubmitButton
                        text="บันทึกข้อมูลสถานที่"
                        size="lg"
                    />
                </div>
            </FormContainer>
        </section>
    </>
    )
}

export default CreateLocation