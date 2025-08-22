import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress } from "@mui/material";
import { GridLocaleText } from "@mui/x-data-grid";

const localesPath = "../node_modules/@mui/x-data-grid/esm/locales/";

const locales = import.meta.glob(
  "../node_modules/@mui/x-data-grid/esm/locales/*.js"
);

// Sample data
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 130 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "age", headerName: "Age", type: "number", width: 90 },
];

const rows = [
  { id: 1, name: "John Doe", email: "john@example.com", age: 35 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", age: 28 },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 45 },
  { id: 4, name: "Alice Brown", email: "alice@example.com", age: 32 },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com", age: 29 },
];

export default function SimpleDynamicLocalizationDemo() {
  const [locale, setLocale] = React.useState<Partial<GridLocaleText>>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadLocale() {
      const browserLocale = navigator.language || "en-US";
      const muiLocale = browserLocale.replace("-", "");
      const module = (await locales[`${localesPath}${muiLocale}.js`]()) as any;
      setLocale(
        module[muiLocale].components.MuiDataGrid.defaultProps.localeText
      );
      setLoading(false);
    }

    loadLocale();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Simple Dynamic Localization
      </Typography>
      <Typography variant="body1" paragraph>
        This Data Grid automatically loads the appropriate locale based on your
        browser's language setting ({navigator.language}). The locale is loaded
        dynamically, reducing the initial bundle size.
      </Typography>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          localeText={locale}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Box>
    </Box>
  );
}
