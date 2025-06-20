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
                    className="flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-300 text-gray-700 dark:text-white py-1.5 px-2 rounded-lg transition-colors duration-200 text-sm"
                >
                    <Share2 />
                </Button>
            </PopoverTrigger>
            <PopoverContent side='bottom' align='end' className="flex w-full gap-2 items-center">
                <FacebookShareButton url={shareLink} name={name}>
                    <FacebookIcon size={'36px'} className="rounded-lg" />
                </FacebookShareButton>
                <TwitterShareButton url={shareLink} title={name}>
                    <TwitterIcon size={'36px'} className="rounded-lg" />
                </TwitterShareButton>
                <WhatsappShareButton url={shareLink} title={name}>
                    <WhatsappIcon size={'36px'} className="rounded-lg" />
                </WhatsappShareButton>
            </PopoverContent>
        </Popover >

    )
}
export default ShareButton