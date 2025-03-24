import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

export default function AddRecord() {
    return (
        <Button className="size-14 rounded-full">
            <Icon icon='material-symbols:add-2-rounded' className="size-8" />
        </Button>
    );
}
