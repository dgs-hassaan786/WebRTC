//***********Domain Object Class
function DomainObject() {

    var self = this;

    self.CreatedBy = '';
    self.ModifiedBy = '';
    self.ProgramId = '';
    self.Deleted = false;
    self.ModifiedOn = new Date();
    self.CreatedOn = new Date();
    self.Id = '';   
    return self;
}

//***********User Class
function Users(){

    var self = this;

    self.RoleId = '';    
    self.FirstName = '';
    self.LastName = '';
    self.Email = '';
    self.PasswordHsitory = [];
    self.ClaimIds = [];
    self.GroupCode = constant.GroupCode;
    self.PasswordHistory = [];
    self.Projects = [];

    return self;
}

//*********** Roles Class
function Roles() {    
    var self = this;
    self.Deleted = false;
    self.Claims = [];
    return self;
}

//*********** Template Class
function Templates() {

    var self = this;    
    self.IsActive = true;
    return self;
}

//*********** Extending classes using inheritance 
Users.prototype = new DomainObject();
Templates.prototype = new DomainObject();
Roles.prototype = new DomainObject();




