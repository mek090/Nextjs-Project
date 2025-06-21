'use client'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Share2 } from 'lucide-react';
import { Button } from "../ui/button";

import {
    TwitterShareButton,
    FacebookMessengerShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
    FacebookShareButton
} from 'react-share'
import { preprocess } from "zod";

const ShareButton = ({
    locationId,
    name
}: {
    locationId: string,
    name: string
}) => {

    const url = process.env.NEXT_PUBLIC_WEBSITE_URL
    const shareLink = `${url}/locations/${locationId}`

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="lg"
                    className="flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-300 text-gray-700 dark:text-white py-1.5 px-1.5 sm:px-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm"
                >
                    <Share2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent side='bottom' align='end' className="flex w-full gap-1 sm:gap-1.5 md:gap-2 items-center p-1.5 sm:p-2 md:p-3">
                <FacebookShareButton url={shareLink} name={name}>
                    <FacebookIcon size={'28px'} className="rounded-lg sm:w-8 sm:h-8 md:w-9 md:h-9" />
                </FacebookShareButton>
                <TwitterShareButton url={shareLink} title={name}>
                    <TwitterIcon size={'28px'} className="rounded-lg sm:w-8 sm:h-8 md:w-9 md:h-9" />
                </TwitterShareButton>
                <WhatsappShareButton url={shareLink} title={name}>
                    <WhatsappIcon size={'28px'} className="rounded-lg sm:w-8 sm:h-8 md:w-9 md:h-9" />
                </WhatsappShareButton>
            </PopoverContent>
        </Popover >

    )
}
export default ShareButton