
const express = require('express');
const router = express.Router();
const pool = require('../db/Index');


router.get('/', async(req,res,next)=> {
    let logger = {
      "logged" :  req.session.log,
      };
      if (req.session.idAdmin) {
      const text =req.url.split("text=")[1];

      if (text == undefined) {
        const productos = await pool.query('select * from productos INNER JOIN categorias ON productos.categoria_p = categorias.id_c');
        const categorias = await pool.query('select * from categorias');
      res.render('admin', {message : 'Bienvenido Admin ' + req.session.nombre, productos, categorias, title : 'Cat Glam · Mi Cuenta', logger:logger});
}
    else {
//         SELECT * 
// FROM productos INNER JOIN categorias ON productos.categoria_p = categorias.id_c 
// WHERE nombre_p LIKE '%Aro%' OR descripcion_p LIKE '%Aro%' OR categoria_p LIKE '%Aro%'
        const productos = await pool.query("select * from productos INNER JOIN categorias ON productos.categoria_p = categorias.id_c WHERE nombre_p LIKE '%"+ text +"%'");
        const categorias = await pool.query('select * from categorias')
        res.render('admin', {message : 'Bienvenido Admin ' + req.session.nombre, title : 'Cat Glam · Panel de Control', productos, categorias, logger:logger});
  
    }
}
    else
    {
    res.redirect('/ingreso');
}
    })

    router.post('/subir/',async (req,res) => {
      console.log("Control");
      const categoriaId = await pool.query('select id_c from categorias where nombre_c = \"'
      + req.body.categoria + '\"');
      let nuevoProducto = {
          nombre_p: req.body.producto,
          descripcion_p: req.body.descripcion,
          categoria_p: categoriaId[0].id_c,
          precio_p: req.body.precio,
          stock_p: req.body.stock,
          imagen_p: req.body.imagen,
      }
      console.log(nuevoProducto);
      await pool.query('insert into productos set ?', [nuevoProducto]);
      res.send('Received');
    })
    
    router.post("/modificar/", async(req, res) => { console.log(req.body)
      try {
         await pool.query("UPDATE productos SET nombre_p = \""
        + req.body.nombre + "\" WHERE id_p = " + req.body.id);
        console.log(asd)
        res.status(200)
      } catch (error) {
          console.log("asda")
        res.status(400).json({ error: error})
      }
    })
    router.delete("/eliminar/:id", async(req,res) => { console.log("asdasd")
      try {
        await pool.query("DELETE FROM productos WHERE id_p = " +req.params.id);
        console.log("loborre");
      } catch (error) {
        alert("MAL")
      }
    })
    module.exports = router;