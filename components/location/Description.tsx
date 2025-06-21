

const Description = ({
    description
}: {
    description: string
}) => {
    return (
        <article className="my-2 sm:my-4">
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-light leading-relaxed sm:leading-loose">
                {description}
            </p>
        </article>
    )
}
export default Description