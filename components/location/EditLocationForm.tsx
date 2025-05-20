import { updateLocationAction } from "@/actions/actions"
import SubmitButton from "@/components/form/Button"
import CategoryInput from "@/components/form/CategoryInput"
import FormInput from "@/components/form/Form"
import FormContainer from "@/components/form/FormContainer"
import ProvincesInput from "@/components/form/DistrictsInput"
import TextareaInput from "@/components/form/TextareaInput"
import MapLocation from "@/components/map/MapLocation"
import ImageInput from "@/components/form/ImageInput"
import { LocationCardProps } from "@/utils/types"

interface EditLocationFormProps {
    location: LocationCardProps
}

const EditLocationForm = ({ location }: EditLocationFormProps) => {
    return (
        <FormContainer action={updateLocationAction}>
            <input type="hidden" name="id" value={location.id} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormInput
                    name="name"
                    label="ชื่อสถานที่"
                    type="text"
                    placeholder="ต้องไม่ต่ำกว่า 2 ตัวอักษร"
                    defaultValue={location.name}
                />
                <CategoryInput defaultValue={location.category} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                    <FormInput
                        name="price"
                        label="ราคาค่าเข้าชม"
                        type="text"
                        placeholder="เช่น ฟรี, 0-100, ติดต่อสอบถาม"
                        defaultValue={location.price}
                    />
                    <p className="text-sm text-gray-500">ระบุราคา เช่น "ฟรี", "0-100 บาท", "ติดต่อสอบถาม"</p>
                </div>
                <ProvincesInput defaultValue={location.districts} />
            </div>

            <div className="mb-6">
                <TextareaInput
                    name="description"
                    LabelText="รายละเอียดสถานที่"
                    defaultValue={location.description}
                />
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">รูปภาพสถานที่</h2>
                <p className="text-sm text-gray-600 mb-3">อัพโหลดรูปภาพสถานที่ท่องเที่ยว</p>
                <ImageInput defaultValue={location.image} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormInput
                    name="openTime"
                    label="เวลาเปิด (ไม่จำเป็น)"
                    type="time"
                    defaultValue={location.openTime}
                />

                <FormInput
                    name="closeTime"
                    label="เวลาปิด (ไม่จำเป็น)"
                    type="time"
                    defaultValue={location.closeTime}
                />
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">ตำแหน่งที่ตั้ง</h2>
                <p className="text-sm text-gray-600 mb-3">คลิกบนแผนที่เพื่อระบุตำแหน่งที่ตั้งที่แน่นอน</p>
                <MapLocation location={{ lat: location.lat, lng: location.lng }} />
            </div>

            <div className="mt-8 text-center">
                <SubmitButton
                    text="บันทึกการแก้ไข"
                    size="lg"
                />
            </div>
        </FormContainer>
    )
}

export default EditLocationForm 