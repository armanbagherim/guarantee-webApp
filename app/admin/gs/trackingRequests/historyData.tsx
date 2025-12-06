import { fetcher } from "@/app/components/admin-components/fetcher";
import {
  Dialog,
  DialogContent,
  Skeleton,
  Button,
  Chip,
  Avatar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { History, Restore, ArrowBack, Download } from "@mui/icons-material";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Vazir",
  src: "https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Light.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontFamily: "Vazir",
    direction: "rtl",
    fontSize: 9,
    textAlign: "right",
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: { fontSize: 12, fontWeight: "bold", color: "#1e40af" },
  reqId: { fontSize: 9, color: "#4b5563" },
  date: { fontSize: 8, color: "#6b7280" },

  bundleContainer: {
    marginBottom: 10,
    position: "relative",
  },
  bundleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  bundleTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  bundleCount: {
    fontSize: 8,
    color: "#6b7280",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 8,
    marginBottom: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  command: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    color: "white",
    fontWeight: "bold",
    fontSize: 9,
  },
  time: { fontSize: 8, color: "#64748b" },

  fromToContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 8,
    marginBottom: 6,
  },
  fromToRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 4,
  },
  fromToRowLast: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 0,
  },
  label: { fontSize: 8, color: "#4b5563", marginLeft: 8 },
  name: { fontSize: 8, fontWeight: "bold" },
  fromName: { color: "#059669" },
  toName: { color: "#2563eb" },

  description: {
    marginTop: 6,
    padding: 6,
    backgroundColor: "#fefce8",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fde68a",
    fontSize: 8,
    color: "#92400e",
    textAlign: "right",
  },

  footer: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 7,
    color: "#9ca3b8",
  },
});

const HistoryPDF = ({
  data,
  requestId,
}: {
  data: any[];
  requestId: string;
}) => {
  const grouped = Object.entries(
    data.reduce((acc: any, item: any) => {
      (acc[item.executeBundle] = acc[item.executeBundle] || []).push(item);
      return acc;
    }, {})
  ).sort(([a]: any, [b]: any) => Number(a) - Number(b));

  const format = (d: string) =>
    new Date(d).toLocaleString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const color = (cmd: string) => {
    const map: any = {
      APPROVE: "#10b981",
      REJECT: "#ef4444",
      EDIT: "#3b82f6",
      FORWARD: "#f59e0b",
      CREATE: "#8b5cf6",
    };
    return map[cmd] || "#6b7280";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>تاریخچه درخواست</Text>
            <Text style={styles.reqId}>#{requestId}</Text>
          </View>
          <Text style={styles.date}>{new Date().toLocaleString("fa-IR")}</Text>
        </View>

        {grouped.map(([bundle, items]: any, index) => (
          <View
            key={bundle}
            style={styles.bundleContainer}
            break={index > 0 && index % 3 === 0}
          >
            <View style={styles.bundleHeader}>
              <Text style={styles.bundleTitle}>مرحله {index + 1}</Text>
              <Text style={styles.bundleCount}>{items.length} عملیات</Text>
            </View>

            {items
              .sort(
                (a: any, b: any) =>
                  new Date(a.createdAt) - new Date(b.createdAt)
              )
              .map((item: any) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.topRow}>
                    <Text
                      style={[
                        styles.command,
                        { backgroundColor: color(item.nodeCommand) },
                      ]}
                    >
                      {item.nodeCommand}
                    </Text>
                    <Text style={styles.time}>{format(item.createdAt)}</Text>
                  </View>

                  <View style={styles.fromToContainer}>
                    <View style={styles.fromToRow}>
                      <Text style={[styles.name, styles.fromName]}>
                        {item.from || "—"}
                      </Text>
                      <Text style={styles.label}>از:</Text>
                    </View>
                    <View style={styles.fromToRowLast}>
                      <Text style={[styles.name, styles.toName]}>
                        {item.to || "—"}
                      </Text>
                      <Text style={styles.label}>به:</Text>
                    </View>
                  </View>

                  {item.description && (
                    <View style={styles.description}>
                      <Text>توضیحات: {item.description}</Text>
                    </View>
                  )}
                </View>
              ))}
          </View>
        ))}

        <Text style={styles.footer}>
          گزارش تاریخچه درخواست • {new Date().toLocaleDateString("fa-IR")}
        </Text>
      </Page>
    </Document>
  );
};

export default function HistoryData({
  historyOpen,
  setHistoryOpen,
}: {
  historyOpen: any;
  setHistoryOpen: any;
}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revertLoading, setRevertLoading] = useState<{
    [key: string]: boolean;
  }>({});

  const getHistoryById = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetcher({
        url: `/v1/api/guarantee/cartable/histories/requestId/${id}?ignorePaging=true&sortOrder=ASC`,
        method: "GET",
      });
      setData(res.result || []);
    } catch (error) {
      console.error("Error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async (executeBundle: string) => {
    if (!historyOpen.requestId || !executeBundle) return;
    setRevertLoading((prev) => ({ ...prev, [executeBundle]: true }));
    try {
      await fetcher({
        url: `/v1/api/guarantee/cartable/revert-request/byHistory`,
        method: "POST",
        body: { requestId: parseInt(historyOpen.requestId, 10), executeBundle },
      });
      getHistoryById(historyOpen.requestId);
    } catch (error) {
      console.error("Revert error:", error);
    } finally {
      setRevertLoading((prev) => ({ ...prev, [executeBundle]: false }));
    }
  };

  const handleDownloadPDF = async () => {
    if (data.length === 0) {
      alert("داده‌ای برای تولید PDF وجود ندارد");
      return;
    }
    const blob = await pdf(
      <HistoryPDF data={data} requestId={historyOpen.requestId} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `تاریخچه-درخواست-${historyOpen.requestId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (historyOpen.isOpen && historyOpen.requestId) {
      getHistoryById(historyOpen.requestId);
    } else {
      setData([]);
    }
  }, [historyOpen.isOpen, historyOpen.requestId]);

  const formatDate = (d: string) => new Date(d).toLocaleString("fa-IR");

  const groupedData = useMemo(() => {
    const g: any = {};
    data.forEach((i) =>
      (g[i.executeBundle] = g[i.executeBundle] || []).push(i)
    );
    Object.keys(g).forEach((k) =>
      g[k].sort(
        (a: any, b: any) => new Date(a.createdAt) - new Date(b.createdAt)
      )
    );
    return g;
  }, [data]);

  const getCommandColor = (c: string) => {
    const colors: any = {
      APPROVE: "#4caf50",
      REJECT: "#f44336",
      EDIT: "#2196f3",
      FORWARD: "#ff9800",
      CREATE: "#9c27b0",
    };
    return colors[c] || "#607d8b";
  };

  return (
    <Dialog
      open={historyOpen.isOpen}
      onClose={() => setHistoryOpen((p) => ({ ...p, isOpen: false }))}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
      }}
    >
      <DialogContent className="p-0">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                <History />
              </Avatar>
              <div>
                <Typography variant="h5" fontWeight="bold">
                  تاریخچه درخواست
                </Typography>
                <Typography variant="body2">
                  شماره درخواست: #{historyOpen.requestId}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownloadPDF}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                }}
              >
                دانلود PDF
              </Button>
              <Button
                variant="text"
                color="inherit"
                onClick={() => setHistoryOpen((p) => ({ ...p, isOpen: false }))}
              >
                ✕
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto" dir="rtl">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton variant="circular" width={40} height={40} />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="100%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </div>
                </div>
              ))}
            </div>
          ) : Object.keys(groupedData).length > 0 ? (
            <div>
              {Object.entries(groupedData).map(
                ([bundle, items]: any, bundleIndex) => (
                  <div key={bundle} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center z-10">
                          <span className="text-blue-600 font-bold">
                            {bundleIndex + 1}
                          </span>
                        </div>
                        <Typography variant="h6" fontWeight="medium">
                          مرحله {bundleIndex + 1}
                        </Typography>
                        <Chip
                          label={`${items.length} عملیات`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </div>
                      <Button
                        variant="outlined"
                        startIcon={<Restore />}
                        onClick={() => handleRevert(bundle)}
                        disabled={revertLoading[bundle]}
                        size="small"
                        sx={{ borderRadius: 2 }}
                      >
                        {revertLoading[bundle]
                          ? "در حال بازگشت..."
                          : "بازگشت به این مرحله"}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {items.map((item: any) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Chip
                                label={item.nodeCommand}
                                size="small"
                                sx={{
                                  backgroundColor: getCommandColor(
                                    item.nodeCommand
                                  ),
                                  color: "white",
                                  fontWeight: "bold",
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(item.createdAt)}
                              </Typography>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 my-3">
                            <div className="flex-1 text-right">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                از:
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight="medium"
                                className="text-green-700"
                              >
                                {item.from}
                              </Typography>
                            </div>
                            <ArrowBack color="action" fontSize="small" />
                            <div className="flex-1 text-right">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                به:
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight="medium"
                                className="text-blue-600"
                              >
                                {item.to}
                              </Typography>
                            </div>
                          </div>
                          {item.description && (
                            <Box
                              sx={{
                                mt: 2,
                                p: 2,
                                bgcolor: "grey.50",
                                borderRadius: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                توضیحات: {item.description}
                              </Typography>
                            </Box>
                          )}
                        </div>
                      ))}
                    </div>
                    {bundleIndex < Object.keys(groupedData).length - 1 && (
                      <Divider sx={{ mt: 4, mb: 2 }} />
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <History sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                هیچ تاریخچه‌ای یافت نشد
              </Typography>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
