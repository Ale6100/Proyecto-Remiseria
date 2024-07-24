import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Shadcn/table";
import { flexRender } from "@tanstack/react-table";

const TableGral = ({ table, msgEmpty }) => {
    return (
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                    return (
                    <TableHead key={header.id} className='font-bold text-black text-sm max-md:text-xs'>
                        {
                        header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())
                        }
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className='max-md:text-xs'>
                        {row.getVisibleCells().map(cell => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={ table.getAllColumns() } className="h-24 text-center">
                            {msgEmpty}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default TableGral;