const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../index');
const { database, meal_database } = require('../../utils/database');
let index = database.users.length;
require('tracer').setLevel('error');
chai.should();
chai.use(chaiHttp);
// Test case UC-201.
describe('Register User', function () {
  it('TC-201-1 should register a new user successfully', (done) => {
    const newUser = {
      id: index++,
      firstname: 'John',
      lastname: 'Doe',
      street: 'Main Street',
      city: 'Amsterdam',
      emailaddress: 'john.doe@example.com',
      password: 'Abcde@123',
      phonenumber: '0612345678',
    };
    chai
      .request(app)
      .post('/api/user')
      .send(newUser)
      .end((err, res) => {
        assert(err === null);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(200);
        res.body.should.have.property('message').to.be.a('string');
        res.body.should.have.property('data').to.be.an('object');

        let { data, message, status } = res.body;

        message.should.be.equal(
          `Gebruiker met id ${newUser.id} is geregistreerd`
        );

        data.should.have.property('firstname').to.be.equal('John');
        data.should.have.property('lastname').to.be.equal('Doe');
        data.should.have.property('street').to.be.equal('Main Street');
        data.should.have.property('city').to.be.equal('Amsterdam');
        data.should.have
          .property('emailaddress')
          .to.be.equal('john.doe@example.com');
        data.should.have.property('password').to.be.equal('Abcde@123');
        data.should.have.property('phonenumber').to.be.equal('0612345678');
        done();
      });
  });

  it('TC-201-2 should return an error if email address is invalid', (done) => {
    const newUser = {
      firstname: 'John',
      lastname: 'Doe',
      street: 'Main Street',
      city: 'Amsterdam',
      emailaddress: 'john.doe@.example', // Ongeldig e-mailadres
      password: 'Abcde@123',
      phonenumber: '0612345678',
    };
    chai
      .request(app)
      .post('/api/user')
      .send(newUser)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(400);
        let { data, message, status } = res.body;
        message.should.be.equal('Ongeldig e-mailadres');
        Object.keys(data).length.should.be.equal(0);

        done();
      });
  });

  it('TC-201-3 should return an error if phonenumber is invalid', (done) => {
    const newUser = {
      firstname: 'John',
      lastname: 'Doe',
      street: 'Main Street',
      city: 'Amsterdam',
      emailaddress: 'john.doe@example.com',
      password: 'Abcde@123',
      phonenumber: '612345678', // Ongeldig telefoonnummer
    };
    chai
      .request(app)
      .post('/api/user')
      .send(newUser)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(400);
        let { data, message, status } = res.body;
        message.should.be.equal(
          'Ongeldig telefoonnummer. Het telefoonnummer moet 10 cijfers lang zijn.'
        );
        Object.keys(data).length.should.be.equal(0);

        done();
      });
  });

  it('TC-201-4 should return an error if password is invalid', (done) => {
    const newUser = {
      firstname: 'John',
      lastname: 'Doe',
      street: 'Main Street',
      city: 'Amsterdam',
      emailaddress: 'john.doe@example.com',
      password: 'abcdefg', // Ongeldig wachtwoord
      phonenumber: '0612345678',
    };
    chai
      .request(app)
      .post('/api/user')
      .send(newUser)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(400);
        let { data, message, status } = res.body;
        message.should.be.equal(
          'Ongeldig wachtwoord. Het wachtwoord moet minstens 8 tekens lang zijn, een hoofdletter, een kleine letter, een cijfer en een speciaal teken bevatten.'
        );
        Object.keys(data).length.should.be.equal(0);

        done();
      });
    it('TC-201-5 should return an error if any field is empty', (done) => {
      const newUser = {
        firstname: 'John',
        lastname: '',
        street: 'Main Street',
        city: 'Amsterdam',
        emailaddress: 'john.doe@example.com',
        password: 'Abcde@123',
        phonenumber: '0612345678',
      };
      chai
        .request(app)
        .post('/api/user')
        .send(newUser)
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.should.have.property('status').to.be.equal(400);
          let { data, message, status } = res.body;
          message.should.be.equal('lastName must be a string');
          Object.keys(data).length.should.be.equal(0);

          done();
        });
    });

    it('TC-201-6 should return an error if any field is missing', (done) => {
      const newUser = {
        firstname: 'John',
        // lastname ontbreekt
        street: 'Main Street',
        city: 'Amsterdam',
        emailaddress: 'john.doe@example.com',
        password: 'Abcde@123',
        phonenumber: '0612345678',
      };
      chai
        .request(app)
        .post('/api/user')
        .send(newUser)
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.should.have.property('status').to.be.equal(400);
          let { data, message, status } = res.body;
          message.should.be.equal('lastName must be a string');
          Object.keys(data).length.should.be.equal(0);

          done();
        });
    });

    it('TC-201-7 should return an error if any field type is incorrect', (done) => {
      const newUser = {
        firstname: 'John',
        lastname: 'Doe',
        street: 'Main Street',
        city: 'Amsterdam',
        emailaddress: 'john.doe@example.com',
        password: 'Abcde@123',
        phonenumber: 612345678, // Telefoonnummer als getal i.p.v. string
      };
      chai
        .request(app)
        .post('/api/user')
        .send(newUser)
        .end((err, res) => {
          res.body.should.be.an('object');
          res.body.should.have.property('status').to.be.equal(400);
          let { data, message, status } = res.body;
          message.should.be.equal('phoneNumber must be a string');
          Object.keys(data).length.should.be.equal(0);

          done();
        });
    });
  });
});
// Test case UC-202
describe('Get All Users', function () {
  it('TC-202-1 should return all users in the database', (done) => {
    chai
      .request(app)
      .get('/api/user')
      .end((err, res) => {
        assert(err === null);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(200);
        res.body.should.have.property('message');
        res.body.should.have.property('data');
        let { data, message, status } = res.body;
        data.should.be.an('array');
        message.should.be.equal('server info-endpoint');
        data.length.should.be.equal(database.users.length);
        done();
      });
  });
});
// Test case UC-203
describe('Get User Profile', function () {
  it('TC-203-2 should return user profile data', (done) => {
    const credentials = {
      emailaddress: 'ammar@gmail.com',
      password: 'P@ssw0rd!',
    };
    chai
      .request(app)
      .post('/api/user/profile')
      .send(credentials)
      .end((err, res) => {
        assert(err === null);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(200);
        res.body.should.have.property('message');
        res.body.should.have.property('data');
        let { data, message, status } = res.body;
        data.should.be.an('object');
        message.should.be.equal('Profielgegevens opgehaald');
        data.should.have.property('firstname').to.be.equal('Ammar');
        data.should.have.property('lastname').to.be.equal('almifalani');
        done();
      });
  });

  it('TC-203-3 should return error if user not found', (done) => {
    const credentials = {
      emailaddress: 'nonexistentuser@example.com',
      password: 'P@ssw0rd!',
    };
    chai
      .request(app)
      .post('/api/user/profile')
      .send(credentials)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(404);
        let { data, message, status } = res.body;
        message.should.be.equal('Gebruiker niet gevonden');
        Object.keys(data).length.should.be.equal(0);
        done();
      });
  });

  it('TC-203-4 should return error if password is incorrect', (done) => {
    const credentials = {
      emailaddress: 'ammar@gmail.com',
      password: 'IncorrectPassword!',
    };
    chai
      .request(app)
      .post('/api/user/profile')
      .send(credentials)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(401);
        let { data, message, status } = res.body;
        message.should.be.equal('Ongeldig wachtwoord');
        Object.keys(data).length.should.be.equal(0);
        done();
      });
  });
});
// Test case UC-204
describe('Get User by ID', function () {
  it('UC-204-1 should return user details and meals', (done) => {
    const userId = 0; // Change this to the appropriate user ID in the database
    chai
      .request(app)
      .get(`/api/user/${userId}`)
      .end((err, res) => {
        assert(err === null);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(200);
        res.body.should.have.property('message');
        res.body.should.have.property('data');
        let { data, message, status } = res.body;
        message.should.be.equal('Gebruikersgegevens en maaltijden opgehaald');
        data.should.have.property('firstname');
        data.should.have.property('lastname');
        data.should.have.property('emailaddress');
        data.should.have.property('phonenumber');
        data.should.have.property('meals');
        done();
      });
  });

  it('UC-204-2 should return error for invalid user ID', (done) => {
    const userId = 'invalid';
    chai
      .request(app)
      .get(`/api/user/${userId}`)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(400);
        let { data, message, status } = res.body;
        message.should.be.equal('Ongeldig gebruikers-ID');
        Object.keys(data).length.should.be.equal(0);

        done();
      });
  });

  it('UC-204-3 should return error for user not found', (done) => {
    const userId = 9999999999; // Change this to a non-existent user ID
    chai
      .request(app)
      .get(`/api/user/${userId}`)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(404);
        let { data, message, status } = res.body;
        message.should.be.equal('Gebruiker niet gevonden');
        Object.keys(data).length.should.be.equal(0);

        done();
      });
  });
});
// Test case  UC-205
describe('Update User', function () {
  it('TC-205-1 should update user data', (done) => {
    const requestData = {
      emailaddress: 'ammar@gmail.com',
      password: 'P@ssw0rd!',
      updateData: {
        firstname: 'UpdatedAmmar',
        lastname: 'UpdatedAlmifalani',
        street: '456 Updated St',
        city: 'UpdatedAmsterdam',
        newPassword: 'NewP@ssw0rd!',
        phonenumber: '0698765432',
      },
    };

    chai
      .request(app)
      .put('/api/user/update')
      .send(requestData)
      .end((err, res) => {
        assert(err === null);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(200);
        res.body.should.have.property('message');
        res.body.should.have.property('data');
        let { data, message, status } = res.body;
        message.should.be.equal('Gebruiker is met succes bijgewerkt');
        data.should.be.an('object');
        data.should.have
          .property('firstname')
          .to.be.equal(requestData.updateData.firstname);
        data.should.have
          .property('lastname')
          .to.be.equal(requestData.updateData.lastname);
        data.should.have
          .property('street')
          .to.be.equal(requestData.updateData.street);
        data.should.have
          .property('city')
          .to.be.equal(requestData.updateData.city);
        data.should.have
          .property('password')
          .to.be.equal(requestData.updateData.newPassword);
        data.should.have
          .property('phonenumber')
          .to.be.equal(requestData.updateData.phonenumber);
        done();
      });
  });

  it('TC-205-2 should return error if user not found', (done) => {
    const requestData = {
      emailaddress: 'nonexistentuser@example.com',
      password: 'P@ssw0rd!',
      updateData: {
        firstname: 'UpdatedAmmar',
      },
    };

    chai
      .request(app)
      .put('/api/user/update')
      .send(requestData)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(404);
        let { data, message, status } = res.body;
        message.should.be.equal('Gebruiker niet gevonden');
        Object.keys(data).length.should.be.equal(0);

        done();
      });
  });

  it('TC-205-3 should return error if password is incorrect', (done) => {
    const requestData = {
      emailaddress: 'ammar@gmail.com',
      password: 'IncorrectPassword!',
      updateData: {
        firstname: 'UpdatedAmmar',
      },
    };

    chai
      .request(app)
      .put('/api/user/update')
      .send(requestData)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(401);
        let { data, message, status } = res.body;
        message.should.be.equal('Ongeldig wachtwoord');
        Object.keys(data).length.should.be.equal(0);

        done();
      });
  });
});
// Test case UC-206
describe('Delete User', function () {
  it('TC-206-1 should delete user', (done) => {
    const credentials = {
      emailaddress: 'testuser@gmail.com',
      password: 'P@ssw0rd!',
    };
    chai
      .request(app)
      .delete('/api/user/delete')
      .send(credentials)
      .end((err, res) => {
        console.log('Response body:', res.body);
        assert(err === null);
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(200);
        let { data, message, status } = res.body;
        message.should.be.equal('Gebruiker is met succes verwijderd');
        Object.keys(data).length.should.be.equal(0);

        done();
      });
  });

  it('TC-206-2 should return error if user not found', (done) => {
    const credentials = {
      emailaddress: 'nonexistentuser@example.com',
      password: 'P@ssw0rd!',
    };
    chai
      .request(app)
      .delete('/api/user/delete')
      .send(credentials)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(404);
        let { data, message, status } = res.body;
        message.should.be.equal('Gebruiker niet gevonden');
        Object.keys(data).length.should.be.equal(0);

        done();
      });
  });

  it('TC-206-3 should return error if password is incorrect', (done) => {
    const credentials = {
      emailaddress: 'ammar@gmail.com',
      password: 'IncorrectPassword!',
    };
    chai
      .request(app)
      .delete('/api/user/delete')
      .send(credentials)
      .end((err, res) => {
        res.body.should.be.an('object');
        res.body.should.have.property('status').to.be.equal(401);
        let { data, message, status } = res.body;
        message.should.be.equal('Ongeldig wachtwoord');
        Object.keys(data).length.should.be.equal(0);

        done();
      });
  });
});
