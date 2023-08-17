import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        SeatPlan
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const AboutUsPage = () => {
  const navigate = useNavigate();

  const loginPageHandleClick = () => {
    navigate("/");
  };
  const viewPageHandleClick = () => {
    navigate("/viewSeatPage");
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative" sx={{ background: "#308a38" }}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            About Us
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              About Us
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Welcome to Tsukien Global Seat Planner, the ultimate solution for
              optimizing employee seating arrangements. We're dedicated to
              simplifying the process of assigning seats within Tsukien Global
              Solutions Inc. Our system is designed to ensure efficiency,
              collaboration, and a comfortable workspace for every employee.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                onClick={loginPageHandleClick}
                sx={{ background: "#308a38" }}
              >
                Back to Log In Page
              </Button>
              <Button
                variant="outlined"
                onClick={viewPageHandleClick}
                sx={{ borderColor: "#308a38", color: "#308a38" }}
              >
                View Seat Plan
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {/* Customize the heading for each card */}
                      {card === 1
                        ? "Rex Merto"
                        : card === 2
                        ? "Abigail Calaminos"
                        : card === 3
                        ? "Chin Abelardo"
                        : card === 4
                        ? "Nymwhel Bernardo"
                        : card === 5
                        ? "Kenneth Christian Gutierrez"
                        : "Aldwin Revera"}
                    </Typography>
                    <Typography>
                      {/* Customize the content for each card */}
                      {card === 1
                        ? "Project Manager"
                        : card === 2
                        ? "Front-End Developer"
                        : card === 3
                        ? "Front-End Developer"
                        : card === 4
                        ? "Front-End Developer"
                        : card === 5
                        ? "Back-End Developer"
                        : "Back-End Developer"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Seat
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        ></Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
};
export default AboutUsPage;
