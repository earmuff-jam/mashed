import { Card, CardContent, Divider, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { CategoryRounded, EngineeringRounded, WarningRounded } from '@mui/icons-material';
import PieBarChart from '../../util/Chart/PieBarChart';

const Overview = () => {
  const itemsWithAssociatedCosts = []?.reduce((acc, el) => {
    acc = acc + el.price;
    return acc;
  }, 0);

  return (
    <>
      <Typography variant="h4">Overview</Typography>
      <Typography variant="caption">View summary details about your assets.</Typography>
      <Stack spacing={{ xs: 1 }}>
        <Typography variant="h5" gutterBottom>
          Asset Summary
        </Typography>
        <Stack direction="row" spacing={{ xs: 1 }} useFlexGap flexWrap="wrap">
          <CardItem>
            <ColumnItem
              label="under assigned maintenance plan"
              icon={<EngineeringRounded />}
              color="primary"
              dataLabel={0}
              loading={false}
            />
          </CardItem>
          <CardItem>
            <ColumnItem
              label="under assigned categories"
              icon={<CategoryRounded />}
              color="primary"
              dataLabel={0}
              loading={false}
            />
          </CardItem>
          <CardItem>
            <ColumnItem
              label="require attention"
              icon={<WarningRounded />}
              color="error"
              dataLabel={0}
              loading={false}
            />
          </CardItem>
        </Stack>
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" spacing="2rem" useFlexGap flexWrap="wrap">
              <Stack spacing="2rem">
                <Typography variant="h5">Cost Summary</Typography>
                <RowItem
                  label="Estimated valuation of items"
                  color="text.secondary"
                  dataValue={itemsWithAssociatedCosts}
                />
                <RowItem
                  label="Unestimated items"
                  color="text.secondary"
                  dataValue={1 - [1]?.filter((v) => v.price > 0).length || 0}
                />
              </Stack>
              <Stack>
                <Typography variant="h5" gutterBottom>
                  Product Details
                </Typography>
                <Stack direction="row" spacing="2rem">
                  <Stack spacing="2rem">
                    <RowItem label="Overdue items" color="error.main" dataValue={0} />
                    <RowItem label="All categories" color="text.secondary" dataValue={0} />
                    <RowItem label="All maintenance plans" color="text.secondary" dataValue={0} />
                    <RowItem label="All inventory items" color="text.secondary" dataValue={0} />
                  </Stack>
                  <Stack direction="row" spacing="2rem">
                    <Divider orientation="vertical" />
                    <PieBarChart
                      chartType="pie"
                      height="10rem"
                      legendLabel="Need attention"
                      data={[0, 1, 1 - (0 + 2)].map((v, index) => ({
                        label: ['under categories', 'under maintenance', 'unassigned'][index],
                        count: v,
                        color: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(211, 211, 211)'][index],
                      }))}
                      backgroundColor="rgba(75, 192, 192, 0.4)"
                      borderColor="rgba(75, 192, 192, 1)"
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};

const CardItem = ({ children }) => (
  <Card sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
    <CardContent>{children}</CardContent>
  </Card>
);

const RowItem = ({ label, color, dataValue }) => {
  return (
    <Stack direction="row" justifyContent="space-between" spacing="2rem">
      <Typography color={color}>{label}</Typography>
      <Typography color={color}>{dataValue}</Typography>
    </Stack>
  );
};

const ColumnItem = ({ label, dataLabel, icon, color, loading }) => {
  if (loading) return <Skeleton width="100%" height="1rem" />;
  return (
    <Stack>
      <Typography textAlign="center" variant="h4" color={color}>
        {dataLabel}
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <IconButton disabled size="small">
          {icon}
        </IconButton>
        <Typography variant="caption" textAlign="center">
          item(s)
        </Typography>
      </Stack>
      <Typography>{label}</Typography>
    </Stack>
  );
};

export default Overview;
