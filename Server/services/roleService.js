const Role = require('../models/Role')

const createRole = async(role) => {
    return await Role.create(role)
}

const deleteRole = async(roleId) => {
    const role = await Role.findByPk(roleId)
    await role.destroy()
    return role
}

const updateRole = async(data, roleId) => {
    await Role.update(data, {where: {id: roleId}})
    return Role.findByPk(roleId)
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