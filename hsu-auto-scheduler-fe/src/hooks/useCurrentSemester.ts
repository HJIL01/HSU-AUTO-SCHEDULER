import { createCPSATSchemaDefaultValues } from "@/types/schemas/CreateCPSAT.schema";
import { useParams } from "next/navigation";

export default function useCurrentSemester() {
  const params = useParams();
  const semester = params["semester"];

  return (semester as string) ?? createCPSATSchemaDefaultValues.semester;
}
