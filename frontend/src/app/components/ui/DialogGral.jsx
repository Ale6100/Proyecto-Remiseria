import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/Shadcn/dialog";
import { Button } from "@/app/components/ui/Shadcn/button";

const DialogGral = ({ dialogOpen, setDialogOpen, title, description, btnText, btnAction }) => {
    return (
        <Dialog open={dialogOpen.state} onOpenChange={setDialogOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{ title }</DialogTitle>
                <DialogDescription>
                    { description }
                </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={ btnAction }>{ btnText }</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DialogGral
