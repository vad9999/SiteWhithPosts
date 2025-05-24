const Role = require('../models/Role')

const createRole = (role) => Role.create(role)

const deleteRole = async (roleId) => {
    const role = await Role.findByPk(roleId)
    if (!role) return null
    await role.destroy()
    return role
}

const updateRole = async (data, roleId) => {
    const role = await Role.findByPk(roleId)
    if (!role) return null
    await role.update(data)
    return role
}

const getAllRoles = async() => {
    return await Role.findAll()
}

module.exports = {
    createRole,
    deleteRole,
    updateRole,
    getAllRoles
}