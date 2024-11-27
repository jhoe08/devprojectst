class UserRole {
    constructor(roleName, employeeId, permissions) {
        this._employeeId = employeeId;
        this._roleName = roleName;
        // this._permissions = permissions || [];
    }

    // Getter for employeeId
    get employeeId() {
        return this._employeeId;
    }

    // Setter for employeeId
    set employeeId(id) {
        this._employeeId = id;
    }

    // Getter for roleName
    get roleName() {
        return this._roleName;
    }

    // Setter for roleName
    set roleName(name) {
        this._roleName = name;
    }

    // // Getter for permissions
    // get permissions() {
    //     return this._permissions;
    // }

    // // Setter for permissions
    // set permissions(perms) {
    //     this._permissions = perms;
    // }

    // Method to add a permission
    addPermission(permission) {
        if (!this._permissions.includes(permission)) {
            this._permissions.push(permission);
        }
    }

    // Method to remove a permission
    removePermission(permission) {
        this._permissions = this._permissions.filter(perm => perm !== permission);
    }
}

// Example usage
const superadmin = new UserRole('Superadmin', 984);
// const admin = new UserRole(2, 'Admin');
// const editor = new UserRole(3, 'Editor');
// const user = new UserRole(4, 'User');

// Adding permissions
// superadmin.addPermission('manage_users');
// admin.addPermission('edit_content');

// // Getting values
// console.log(superadmin.roleName); // "Superadmin"
// console.log(admin.permissions); // ["edit_content"]

// // Setting new values
// user.roleName = 'Regular User';
// console.log(user.roleName); // "Regular User"
