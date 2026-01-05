const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const { nextTick } = require('process');
dotenv.config();

const app = express();
const port = process.env.PORT || 3003 ;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(morgan('dev'));

app.use('public' , express.static(path.join(__dirname , 'public')));

app.use((req, res, next) => {
  const _json = res.json.bind(res);
  res.json = (data) => {
    const fixed = JSON.parse(JSON.stringify(data, (_k, v) =>
      typeof v === 'bigint' ? Number(v) : v
    ));
    return _json(fixed);
  };
  next();
});

app.get('/' , (req,res)=>{
    res.json ({ success : true , message : "API is Running "});
});


app.use('/auth' , require("./routes/authroutes"));
app.use('/user', require("./routes/userroutes"));
app.use('/food' , require("./routes/foodroutes"));
app.use('/cart' , require("./routes/cartroutes"));
app.use('/order' , require("./routes/orderroutes"));
app.use("/categories", require("./routes/categoryroutes"));
app.listen(port , ()=>{
  console.log('Server Started at Port');
});