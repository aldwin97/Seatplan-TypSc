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
import abi from "./assets/abi.jpg";
import ken from "./assets/kenneth.jpg"
import nym from "./assets/nym.jpg"
import chin from "./assets/chin.jpeg"
import aldwin from "./assets/aldwin.jpeg"
import cvr from "../assets/BG1.jpg"
import styles from "./aboutusPage.module.css";
import defaulImage from "../assets/default.png"
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FaGithub, FaGoogle,FaLinkedin, FaLinkedinIn } from 'react-icons/fa';


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
const cardData = [
  { name: "Rex Merto", role: "Project Manager", image: defaulImage },
  { name: "Abigail Calaminos", role: "Front-End Developer", image: abi },
  { name: "Chin Abelardo", role: "Front-End Developer", image: chin },
  { name: "Nymwhel Bernardo", role: "Front-End Developer", image: nym },
  { name: "Kenneth Christian Gutierrez", role: "Back-End Developer", image: ken },
  { name: "Aldwin Revera", role: "Back-End Developer", image: aldwin },
];



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
    <body>
      <CssBaseline />
     
        
        <Box
sx={{
  backgroundImage: `url(${cvr})`,
  backgroundSize: 'cover', // Adjust as needed (cover, contain, etc.)
  backgroundPosition: 'center',
  height:'1300px' // Adjust as needed (center, top, bottom, etc.)
}}
        >
          <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
          <div className={styles["logo-box"]}></div>
          
          </Typography>
        </Toolbar>
          <Container >
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              fontWeight="Bolder"
              marginTop="300px"
              gutterBottom
            >
              
Elevate Your Workspace: Seamlessly Redefine Seating for Enhanced Efficiency and Collaboration.
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
                sx={{
                  background: "#308a38",
                  height: "80px",
                  width: "300px",
                  top: "30px",
                  "&:hover": {
                    backgroundColor: "#076307", 
                  },
                }}
              >
                
                Back to Log In Page
              </Button>
              <Button
                variant="outlined"
                onClick={viewPageHandleClick}
                sx={{ borderColor: "#308a38",height:"80px", width:"300px", top:"30px", color:"#308a38",
                "&:hover": {
                  backgroundColor: "#076307" ,color:"white", 
                }, }}
              >
                View Seat Plan
              </Button>
            </Stack>
           
          </Container>
         
        </Box>
        
      <main>
        {/* Hero unit */}
       
      
       <Box sx={{marginTop:"56px",backgroundColor:"white"}}>  <Typography
              component="h3"
              variant="h3"
              align="center"
              color="text.primary"
              fontWeight="Bold"
              line-height="0.75"
              letter-spacing= "10.8px"
              padding-bottom= "14px"
              gutterBottom
             
            >Who we are</Typography><Typography 
            font-Family= "Merriweather"
            align="center"
            fontStyle="Italic"
            fontSize= "24px"
            fontWeight="400"
            color="#989898"
            textTransform= "uppercase"
            letterSpacing="3.6px"
            marginBottom= "55px"
            >Our team</Typography>
        <Container>
          <Grid container spacing={3}>
            {cardData.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: 500, boxShadow: "0 2px 10px #efefef" }}>
                  <CardMedia
                    component="div"
                    sx={{
                      background: `url(${card.image}) no-repeat center center`,
                      backgroundSize: "cover",
                      height: "250px",
                      width: "250px",
                      borderRadius: "100%",
                      margin: "30px auto",
                      border: "6px solid #efefef",
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.name}
                    </Typography>
                    <Typography align="center">{card.role}</Typography>
                  </CardContent>
                  <CardActions sx={{
             paddingTop:"35px" ,justifyContent: "center"}}>
                    <Button size="small"        sx={{
           position: "relative", // Create a stacking context
           "&::before": {
             content: '""',
             position: "absolute",
             top: "-4px", 
             left: "50%",
             transform: "translateX(-50%)",
             width: "650px", 
             height: "2px", 
             backgroundColor: "#efefef", 
             
             
          },
        }}
 > 
   <FaGithub size={24} color="#999999" className="styles.socialicons"  />
   <FaGoogle size={24} color="#999999" />
   <FaLinkedin size={24} color="#999999" />
 </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        </Box>
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
    </body>
  );
};
export default AboutUsPage;
