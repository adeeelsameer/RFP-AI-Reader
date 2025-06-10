import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";

function ResponsiveAppBar() {
  return (
    <AppBar
      position="absolute"
      sx={{
        backgroundColor: "#FFFFFF",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src="/manni-png.png"
              alt="Logo"
              width={150}
              height={50}
              style={{ display: "block" }}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
