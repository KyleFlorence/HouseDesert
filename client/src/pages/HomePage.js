import { useState } from 'react';
import { Button, Container, TextField, Grid, Box, Alert, AlertTitle, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LeafletMap from '../components/LeafletMap';
const fetch = require('node-fetch');

// TODO: Future plans
// Allow user to enter in more than 1 address and get results for each?
// Allow user to enter time of day? day of week?

export default function HomePage() {

  const [address, setAddress] = useState('');
  const [store, setStore] = useState('');
  const [listOfStores, setListOfStores] = useState([]);
  const [resultData, setResultData] = useState({});
  const [homeData, setHomeData] = useState({})
  const [addAnother, setAddAnother] = useState(true);
  const [invalidSearch, setInvalidSearch] = useState(false);
  const [invalidAddress, setInvalidAddress] = useState(false);
  const [fetchingBool, setFetchingBool] = useState(false);

  const handleSearch = () => {
    if (address === '' || listOfStores.length === 0) {
      setInvalidSearch(true)
    } else {
      setFetchingBool(true)
      // remove invalid warnings
      setInvalidAddress(false)
      setInvalidSearch(false)

      // create the query string
      let storeString = ''
      listOfStores.forEach(s => {
        storeString = storeString + `${s}/`
      })
      // remove the last slash to make parsing easier :)
      storeString = storeString.substring(0, storeString.length - 1);

      // begin fetching
      const baseAddress = process.env.NODE_ENV === 'production' ?
        `/address/${address}/${storeString}` :
        `http://localhost:8080/address/${address}/${storeString}`
      fetch(baseAddress)
        .then(res => res.json())
        .then(resJson => {
          if (resJson.length === undefined) {
            // unable to find address
            setInvalidAddress(true)
          } else {
            setHomeData(resJson[0])
            setResultData(resJson.slice(1))
          }
          setFetchingBool(false)
        })
    }
  }

  const handleAddressChange = (event) => {
    setAddress(event.target.value)
  }

  const handleStoreChange = (event) => {
    setStore(event.target.value)
  }

  const handleCreateStore = () => {
    if (store !== '') {
      setListOfStores([...listOfStores, store]);
      setStore('');
      setAddAnother(true)
    }
  }

  const handleResetAll = () => {
    setListOfStores([]);
    setInvalidSearch(false);
    setResultData({});
  }

  const handleLoadDefaults = () => {
    setListOfStores([
      'Home Depot', 'Lowes', 'Costco', 'Whole Foods', 'Trader Joes', 'Stop and Shop', 'Wegmans', 'Market Basket',
      'Chipotle', 'Chick fil a'
    ])
    setInvalidSearch(false);
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 2 },
    { field: 'time', headerName: 'Time', flex: 0.5 },
    {
      field: 'place_id', headerName: 'Link', flex: 0.5, renderCell: (params) => {
        if (params.value !== null) {
          return (
            <a href={`https://www.google.com/maps/place/?q=place_id:${params.value}`} target="_blank" rel="noopener noreferrer">Link</a>)
        }
      }
    }
  ]

  const cardProps = {
    p: 1,
    m: 1,
    bgcolor: 'grey.300',
    color: 'grey.800',
    border: '1px solid',
    borderColor: 'grey.300',
    borderRadius: 2,
    fontSize: '1rem',
    fontWeight: '700',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingBottom: '20px',
    height: '90%',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center'
  }

  return (
    <Container sx={{ padding: '20px' }}>
      <TextField
        value={address}
        onChange={handleAddressChange}
        sx={{ width: '100%', padding: '10px' }}
        label="Enter Address"
      />
      {invalidAddress &&
        <div style={{ padding: '5px 0px 5px' }}>
          <Alert severity="error">
            <AlertTitle>Invalid Address</AlertTitle>
            Unable to find this address. Please try another.
          </Alert>
        </div>
      }
      <Container>
        <Grid container justifyContent="center" columns={{ xs: 4, sm: 12, md: 12 }} >
          {listOfStores.length > 0 &&
            listOfStores.map((s, index) => {
              return (
                <Grid item xs={2} sm={4} md={3} key={s}>
                  <Box sx={cardProps}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                      <p>{s}</p>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={e => {
                          let data = [...listOfStores];
                          data.splice(index, 1)
                          setListOfStores(data)
                        }}>
                        Delete
                      </Button>
                    </div>
                  </Box>
                </Grid>
              )
            })}
          <Grid item xs={2} sm={4} md={3} key={"input"}>
            <Box sx={cardProps}>
              {addAnother ? (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <Button
                    variant='outlined'
                    color='success'
                    onClick={e => setAddAnother(false)}
                    sx={{ margin: '5px' }}
                  >Add A Store</Button>
                </div>
              ) :
                (
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <TextField
                      value={store}
                      onChange={handleStoreChange}
                      sx={{ width: '100%', padding: '10px' }}
                      label="Add a store"
                      size='small'
                    />
                    <span>
                      <Button
                        color='success'
                        variant='outlined'
                        onClick={handleCreateStore}
                        size='small'
                        sx={{ marginRight: '5px', marginBottom: '5px' }}
                      >Add Store</Button>
                      <Button
                        variant='outlined'
                        color='error'
                        onClick={e => setAddAnother(true)}
                        size='small'
                        sx={{ marginRight: '5px', marginBottom: '5px' }}
                      >Cancel</Button>
                    </span>
                  </div>
                )}

            </Box>
          </Grid>
        </Grid>
      </Container>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '5px 0px 5px' }}>
        <span>
          <Button variant='outlined' sx={{ margin: '5px' }} onClick={handleSearch}>Search</Button>
          <Button variant='outlined' sx={{ margin: '5px' }} onClick={handleResetAll}>Reset All Stores</Button>
          <Button variant='outlined' sx={{ margin: '5px' }} onClick={handleLoadDefaults}>Load Defaults</Button>
        </span>
      </div>
      {fetchingBool &&
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '5px 0px 5px' }}>
          <CircularProgress />
        </div>
      }
      {invalidSearch &&
        <div style={{ padding: '5px 0px 5px' }}>
          <Alert severity="error">
            <AlertTitle>Invalid Search</AlertTitle>
            Please enter an address and at least 1 store.
          </Alert>
        </div>
      }
      {
        resultData.length > 0 &&
        <Container>
          <DataGrid
            rows={resultData}
            columns={columns}
            autoHeight={true}
            columnBuffer={6}
            getRowId={(row) => row.name}
            sx={{ marginBottom: '5px' }}
          />
          <LeafletMap data={[homeData, ...resultData]} />
        </Container>
      }
    </Container>
  );
};