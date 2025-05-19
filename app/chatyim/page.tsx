const page = () => {
    return (

        <div>
            <div className="fixed bottom-24 right-8 z-40 w-[420px] max-w-full rounded-2xl bg-white shadow-2xl transition-all">
                <header className="relative bg-violet-600 px-4 py-3 text-center text-white shadow-md">
                    <h2 className="text-lg font-semibold">Chatbot</h2>
                    <span
                        className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer md:hidden"
                    >
                        close
                    </span>
                </header>

                <ul className="h-[510px] overflow-y-auto px-5 py-8 space-y-4">
                    <li className="flex items-end">
                        <span className="material-symbols-outlined mr-2 flex h-8 w-8 items-center justify-center rounded bg-violet-600 text-white">
                            smart_toy
                        </span>
                        <p className="max-w-[75%] rounded-lg rounded-bl-none bg-gray-200 px-4 py-3 text-sm text-black">
                            สวัสดี <br />
                            ต้องการให้ฉันช่วยอะไรไหม?
                        </p>
                    </li>
                </ul>

                <div className="flex w-full gap-2 border-t border-gray-300 bg-white px-5 py-2">
                    <textarea
                        placeholder="Enter a message..."
                        spellCheck={false}
                        required
                        className="h-[55px] w-full resize-none overflow-y-auto px-3 py-2 text-sm outline-none"
                    />
                    <span className="material-symbols-rounded flex h-[55px] items-end text-xl text-violet-600 cursor-pointer">
                        send
                    </span>
                </div>
            </div>



        </div>
    )
}
export default page