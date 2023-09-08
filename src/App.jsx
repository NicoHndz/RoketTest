import {
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  InputLabel,
  FormControl,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const url = "https://aqh.fitsnr.com/api/aqh/objects";

  const parameters = {
    method: "GET",
    headers: {
      "X-Token": "5Dt4y4fN1Eh8lX1cFKtO",
    },
  };

  const [dataArray, setDataArray] = useState([]);
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [treeName, setTreeName] = useState("");
  const [selectedTree, setSelectedTree] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(url, parameters);
      const ApiData = await response.json();
      setDataArray(ApiData.objetos);
      setLoadingSwitch(true);
    } catch (error) {
      console.log("Error en la solicitud", `${error}`, "error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSelectedTree(
      dataArray.filter((item) => item.object_name == treeName)[0]
    );
  };

  return (
    <Stack alignItems={"center"} p={2} gap={5} bgcolor={"#7EAA92"}>
      <Typography
        variant="h2"
        color={"#FFD9B7"}
        gutterBottom
        fontWeight={700}
        sx={{ textShadow: "1px 1px 1px black" }}
      >
        Welcome
      </Typography>
      <FormControl
        component={"form"}
        onSubmit={(e) => handleSubmit(e)}
        sx={{ width: { xs: "100%", sm: "70%", md: "50%" } }}
      >
        {loadingSwitch ? (
          <Box display={"flex"} gap={1}>
            <InputLabel id="treeSelectorLabel">Select a Tree</InputLabel>
            <Select
              label="treeSelector"
              labelId="treeSelectorLabel"
              value={treeName}
              fullWidth
              onChange={(e) => setTreeName(e.target.value)}
            >
              {dataArray.map((item, i) => (
                <MenuItem key={i} value={item.object_name}>
                  {item.object_name}
                </MenuItem>
              ))}
            </Select>
            {treeName !== "" ? (
              <Button type="submit" variant="contained">
                GET!
              </Button>
            ) : (
              <Button disabled variant="contained">
                GET!
              </Button>
            )}
          </Box>
        ) : (
          <Typography align="center">
            <CircularProgress color="success" />
          </Typography>
        )}
      </FormControl>
      {selectedTree !== null && (
        <Stack bgcolor={"#C8E4B2"} p={1} borderRadius={"10px"}>
          <Typography
            fontWeight={500}
            color={"#7EAA92"}
            variant="h3"
            sx={{ textShadow: "1px 1px 1px black" }}
            gutterBottom
          >
            {selectedTree.object_name}
          </Typography>
          <Stack direction={{ lg: "row" }} gap={3} alignItems={"center"}>
            <Box
              maxWidth={{ xs: "300px", sm: "400px" }}
              maxHeight={{ xs: "395px", sm: "500px" }}
              border={"1px solid #7EAA92"}
              borderRadius={"10px"}
              overflow={"hidden"}
            >
              <img
                src={selectedTree.image_url}
                height={500}
                alt={selectedTree.object_name}
              />
            </Box>
            <Box
              border={"1px solid #7EAA92"}
              borderRadius={"10px"}
              overflow={"hidden"}
            >
              <MapContainer
                center={[selectedTree.lat, selectedTree.lon]}
                zoom={1}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[selectedTree.lat, selectedTree.lon]} />
              </MapContainer>
            </Box>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

export default App;
