import { savePropertyAction } from "@/app/admin/actions";
import { PropertyEditor } from "@/components/admin/PropertyEditor";

export default function NewPropertyPage() { return <PropertyEditor title="Create a property" action={savePropertyAction} />; }
