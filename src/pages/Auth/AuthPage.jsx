import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Snackbar } from "@mui/material";
import { useState } from "react";
import { Password } from "@mui/icons-material";

const defaultTheme = createTheme();

export default function AuthPage() {
  let [formState, setFormState] = useState(0);
  let [message, setMessage] = useState("");
  let [error, setError] = useState();

  const [inputValue, setInputValue] = useState({
    name: "",
    username: "",
    password: "",
  });

  const { name, username, password } = inputValue;
  const [open, setOpen] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputValue);
    setInputValue({
      name: "",
      username: "",
      password: "",
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://th.bing.com/th/id/R.59fa1049aefe72a98e98a2faf6d2a118?rik=fiGeHZ1jXMdR5w&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2f0%2f5%2f8%2f1181284-widescreen-hd-desktop-wallpaper-3840x2160-3840x2160-for-iphone.jpg&ehk=YUl9hsjyan3hSUOmw%2bUfNZxE90%2fXo7Jkh3Oo%2fu0YtM0%3d&risl=1&pid=ImgRaw&r=0)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <div>
              <Button
                variant={formState == 0 ? "contained" : ""}
                onClick={() => setFormState(0)}
              >
                Sign In
              </Button>
              <Button
                variant={formState == 1 ? "contained" : ""}
                onClick={() => setFormState(1)}
              >
                Sign Up
              </Button>
            </div>

            <Box component="form" noValidate sx={{ mt: 1 }}>
              {formState == 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Name"
                  label="Name"
                  name="name"
                  value={name}
                  onChange={handleOnChange}
                  autoFocus
                />
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={handleOnChange}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={handleOnChange}
              />

              {/* <p style={{ color: "red" }}>{error}</p> */}

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                {formState == 0 ? "Login" : "Sign Up"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* <Snackbar open={open} autoHideDuration={4000} message={message} /> */}
    </ThemeProvider>
  );
}
