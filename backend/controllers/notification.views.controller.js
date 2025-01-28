const db = require("../models");
const Notification = db.notification;
const { Op } = require("sequelize");

// Retrieve all notiications
exports.index = (req, res) => {
  findAll(req, res);
};

const findAll = (req, res) => {
  Notification.findAll()
    .then(data => {
      return res.render('notifications/index', { notiications: data });
    })
    .catch(err => {
      return res.render("error", {
        message: err.message || "Some error occurred while retrieving notiications."
      });
    });
}



// // Mostrar todas las notificaciones en una vista
// exports.getAll = async (req, res) => {
//   try {
//     const notifications = await Notification.findAll();
//     res.render("notifications/index", { notifications }); // Renderiza la vista con los datos
//   } catch (error) {
//     res.status(500).render("error", { message: error.message }); // Renderiza una vista de error
//   }
// };


// // Mostrar una sola notificación en una vista
// exports.getOne = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const notification = await Notification.findByPk(id);

//     if (!notification) {
//       return res.status(404).render("error", { message: "Notification not found" });
//     }

//     res.render("notifications/show", { notification }); // Renderiza la vista con los datos
//   } catch (error) {
//     res.status(500).render("error", { message: error.message });
//   }
// };

// // Mostrar el formulario para crear una nueva notificación
// exports.showCreateForm = (req, res) => {
//   res.render("notifications/create"); // Renderiza un formulario vacío
// };

// // Crear una nueva notificación
// exports.addNotification = async (req, res) => {
//   try {
//     const notification = await Notification.create(req.body);
//     res.redirect("/notifications"); // Redirige a la lista de notificaciones después de crearla
//   } catch (error) {
//     res.status(500).render("error", { message: error.message });
//   }
// };

// // Mostrar el formulario para editar una notificación
// exports.showEditForm = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const notification = await Notification.findByPk(id);

//     if (!notification) {
//       return res.status(404).render("error", { message: "Notification not found" });
//     }

//     res.render("notifications/edit", { notification }); // Renderiza un formulario con los datos actuales
//   } catch (error) {
//     res.status(500).render("error", { message: error.message });
//   }
// };

// // Actualizar una notificación existente
// exports.update = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const [updated] = await Notification.update(req.body, { where: { id } });

//     if (updated) {
//       res.redirect(`/notifications/${id}`); // Redirige a la vista de la notificación actualizada
//     } else {
//       res.status(404).render("error", { message: "Notification not found" });
//     }
//   } catch (error) {
//     res.status(500).render("error", { message: error.message });
//   }
// };

// // Eliminar una notificación
// exports.delete = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const deleted = await Notification.destroy({ where: { id } });

//     if (deleted) {
//       res.redirect("/notifications"); // Redirige a la lista después de eliminar
//     } else {
//       res.status(404).render("error", { message: "Notification not found" });
//     }
//   } catch (error) {
//     res.status(500).render("error", { message: error.message });
//   }
// };

