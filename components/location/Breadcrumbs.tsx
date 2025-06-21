import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type BreadcrumbItemType = {
  label: string
  href?: string
}

const Breadcrumbs = ({ items }: { items: BreadcrumbItemType[] }) => {
  return (
    <Breadcrumb className="px-2 sm:px-0">
      <BreadcrumbList className="flex-wrap">
        {items.map((item, index) => (
          <span key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink 
                  href={item.href}
                  className="text-xs sm:text-sm px-1 sm:px-2 py-1"
                >
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-xs sm:text-sm px-1 sm:px-2 py-1">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator className="mx-1 sm:mx-2" />}
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Breadcrumbs
