// const roleService = require('../services/roleService')

// const getRoles = async (req, res) => {
//     try {
//         const roles = await roleService.getAllRoles()
//         res.status(200).json(roles)
//     } catch (e) {
//         console.error('Ошибка получения ролей:', e)
//         res.status(500).json({ error: 'Ошибка сервера' })
//     }
// }

// const addRole = async (req, res) => {
//     try {
//         const role = await roleService.createRole(req.body)
//         res.status(201).json(role)
//     } catch (e) {
//         console.error('Ошибка создания роли:', e)
//         res.status(500).json({ error: 'Ошибка сервера' })
//     }
// }

// const updateRole = async (req, res) => {
//     try {
//         const role = await roleService.updateRole(req.body, req.params.id)
//         if (!role) {
//             return res.status(404).json({ error: 'Роль не найдена' })
//         }
//         res.status(200).json(role)
//     } catch (e) {
//         console.error('Ошибка обновления роли:', e)
//         res.status(500).json({ error: 'Ошибка сервера' })
//     }
// }

// const deleteRole = async (req, res) => {
//     try {
//         const role = await roleService.deleteRole(req.params.id)
//         if (!role) {
//             return res.status(404).json({ error: 'Роль не найдена' })
//         }
//         res.status(200).json(role)
//     } catch (e) {
//         console.error('Ошибка удаления роли:', e)
//         res.status(500).json({ error: 'Ошибка сервера' })
//     }
// }

// module.exports = {
//     getRoles,
//     addRole,
//     updateRole,
//     deleteRole
// }
