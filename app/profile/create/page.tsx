import { createProfileAction } from "@/actions/actions"
import SubmitButton from "@/components/form/Button"
import FormInput from "@/components/form/Form"
import FormContainer from "@/components/form/FormContainer"
import { Button } from "@/components/ui/button"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"






const CreateProfile = async () => {
    const user = await currentUser()
    if (user?.privateMetadata.hasProfile) redirect('/')

    return (
        <section className="max-w-2xl mx-auto p-4 mt-8 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold  mb-4">
                CreateProfile
            </h1>
            <div>
                <FormContainer action={createProfileAction}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <FormInput name="firstname" label="First name" type="text" placeholder="must be at least 2 characters" />
                        <FormInput name="lastname" label="Last name" type="text" placeholder="must be at least 2 characters" />
                        <FormInput name="username" label="User name" type="text" placeholder="must be at least 2 characters" />
                    </div>
                    <SubmitButton text="Create Profile" size='lg' />
                </FormContainer>
            </div>
        </section>
    )
}
export default CreateProfile