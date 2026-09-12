import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useGeneralSettingsContext } from "@/contexts/GeneralSettingsContext";
import { normalizeGeneralSettings } from "@/utils/generalSettings";

interface ReportHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = () => {
  return null;
};


