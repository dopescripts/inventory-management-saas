import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "code",
        header: "Warehouse Code"
    },
    {
        accessorKey: "name",
        header: "Name"
    }
]