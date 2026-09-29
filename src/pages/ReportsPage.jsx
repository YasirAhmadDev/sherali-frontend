import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

import { getErrorMessage } from "@/api/axios";
import { downloadAccidentsCsv, getSummary } from "@/api/reports.api";
import { useFetch } from "@/hooks/useFetch";
import { downloadBlob } from "@/utils/download";
import { formatDate } from "@/utils/formatters";
import { cleanParams } from "@/utils/params";

import Alert from "@/components/common/Alert";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import ReportFilters, { EMPTY_REPORT_FILTERS } from "@/components/reports/ReportFilters";
import SummaryTable from "@/components/reports/SummaryTable";

export default function ReportsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState(EMPTY_REPORT_FILTERS);
  const [downloading, setDownloading] = useState(false);

  const params = useMemo(() => cleanParams(filters), [filters]);
  const { data: summary, loading, error } = useFetch(() => getSummary(params), [JSON.stringify(params)]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await downloadAccidentsCsv(params);
      downloadBlob(blob, `accidents-${formatDate(new Date())}.csv`);
      toast.success("Report downloaded");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={t("nav.reports")}
        subtitle="Summary of accidents for a period. Download the full list as a CSV file (opens in Excel)."
        action={
          <Button icon={Download} loading={downloading} onClick={handleDownload}>
            Download CSV
          </Button>
        }
      />

      <Card className="mb-6">
        <ReportFilters filters={filters} onChange={setFilters} />
      </Card>

      {error && <Alert className="mb-4">{error}</Alert>}
      {!summary && loading && <Loader />}

      {summary && (
        <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
          <SummaryTable summary={summary} />
        </div>
      )}
    </>
  );
}