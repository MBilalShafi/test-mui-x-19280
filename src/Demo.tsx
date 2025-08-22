import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

// Simple locale cache to avoid re-loading
const localeCache = new Map();

/**
 * Dynamically load a Data Grid locale based on the browser's language
 *
 * @param locale - The locale string (e.g., 'fr-FR', 'de-DE')
 * @returns The locale object or null if not found
 */
async function loadDataGridLocale(locale: string) {
  // Convert browser locale format to MUI format (e.g., 'fr-FR' -> 'frFR')
  const muiLocale = locale.replace('-', '');

  // Check cache first
  if (localeCache.has(muiLocale)) {
    return localeCache.get(muiLocale);
  }

  try {
    // Dynamically import the locale
    // Note: This creates a separate chunk for each locale
    const module = await import(`@mui/x-data-grid/locales/${muiLocale}`);
    const localeObject = module[muiLocale];

    // Cache the loaded locale
    localeCache.set(muiLocale, localeObject);

    return localeObject;
  } catch (error) {
    console.warn(`Locale ${locale} not found, falling back to English`);

    // Fall back to English
    const enModule = await import('@mui/x-data-grid/locales/enUS');
    return enModule.enUS;
  }
}

// Sample data
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'age', headerName: 'Age', type: 'number', width: 90 },
];

const rows = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 35 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 28 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45 },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 32 },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 29 },
];

export default function SimpleDynamicLocalizationDemo() {
  const [locale, setLocale] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function loadLocale() {
      try {
        // Get the browser's language
        const browserLocale = navigator.language || 'en-US';

        // Load the locale dynamically
        const loadedLocale = await loadDataGridLocale(browserLocale);

        setLocale(loadedLocale);
        setLoading(false);
      } catch (err) {
        setError('Failed to load locale');
        setLoading(false);
      }
    }

    loadLocale();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
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

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          localeText={locale?.components?.MuiDataGrid?.defaultProps?.localeText}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Box>

      <Typography variant="h6" sx={{ mt: 4 }}>
        How It Works
      </Typography>
      <Typography variant="body2" component="div">
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {`// 1. Detect browser language
const browserLocale = navigator.language; // e.g., 'fr-FR'

// 2. Dynamically import the locale
const module = await import(\`@mui/x-data-grid/locales/\${muiLocale}.js\`);

// 3. Apply to DataGrid
<DataGrid 
  localeText={locale.components.MuiDataGrid.defaultProps.localeText}
  {...otherProps}
/>`}
        </pre>
      </Typography>

      <Typography variant="body2" sx={{ mt: 2 }}>
        <strong>Benefits:</strong>
        <ul>
          <li>Only the needed locale is downloaded</li>
          <li>Automatic code-splitting by webpack/vite</li>
          <li>Smaller initial bundle size</li>
          <li>Falls back to English if locale not found</li>
        </ul>
      </Typography>
    </Box>
  );
}
