import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface MetaLink {
    url: string | null
    label: string
    active: boolean
}

interface PaginationProps {
    links: MetaLink[]
    meta?: {
        current_page: number
        last_page: number
    }
}

export function InertiaPagination({ links }: PaginationProps) {
    // Guard clause for instances with single-page datasets
    if (links.length <= 3) return null

    const previousLink = links[0]
    const nextLink = links[links.length - 1]
    const pageLinks = links.slice(1, -1)

    return (
        <Pagination className="my-4">
            <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                    <PaginationPrevious
                        href={previousLink.url || "#"}
                        className={!previousLink.url ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {/* Numbered Page Links */}
                {pageLinks.map((link, index) => {
                    if (link.label === "...") {
                        return (
                            <PaginationItem key={index}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                    }

                    return (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href={link.url || "#"}
                                isActive={link.active}
                            >
                                {link.label}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}

                {/* Next Button */}
                <PaginationItem>
                    <PaginationNext
                        href={nextLink.url || "#"}
                        className={!nextLink.url ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
