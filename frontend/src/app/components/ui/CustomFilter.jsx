import { Input } from "@/app/components/ui/Shadcn/input";

const CustomFilter = ({ filtering, setFiltering }) => {
    return (
        <div className="flex items-center py-4">
            <Input placeholder="Filtar por cualquier columna" value={filtering} onChange={e => setFiltering(e.target.value)} className="max-w-sm" />
        </div>
    )
}

export default CustomFilter;
