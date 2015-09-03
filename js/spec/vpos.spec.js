(function () {
  "use strict";

    define(['chai', 'chaiAsPromised', 'vpos'], function (chai, chaiAsPromised, vpos) {
        var expect = chai.expect;
        chai.use(chaiAsPromised);

        describe('chai test', function() {
            it('chai should works', function() {
                expect('a').to.equal('a');
            });

        });

        describe('vpos test', function () {

            it("should return an object", function () {
                expect(vpos).to.be.ok;
            });

            it("should return a Locations array object with at least one Location object in it that loads", function (done) {
                this.timeout(5000);

                expect(vpos).to.be.ok;
                expect(vpos.locations).to.be.ok;
                expect(vpos.locations.load).to.be.ok;

                var promise = vpos.locations.load();
                expect(promise).to.be.an.instanceOf(Promise);

                promise.then(function(ret){
                    expect(ret).to.be.an('array');

                    var location = vpos.locations.getAt(0);
                    expect(location).to.be.ok;

                    location.load().then(function(ret){
                        expect(ret).to.be.an('object');
                        expect(ret).to.have.a.property('phone');

                        //updating location (via PUT) not working/implemented...

                        /*
                        var newPhone = "111.222.3333";
                        location.data['phone'] = newPhone;

                        location.save().should.eventually.be.an('object')
                            .and.have.property('phone', newPhone);

                        //reload the data from the server and see if newPhone number persisted
                        location.load().should.eventually.have.a.property('phone', newPhone);
                        */
                        done();

                    }, function(ret){expect.fail()}).catch(function(e){expect.fail()});

                }, function(e){expect.fail()}).catch(function(e){expect.fail();});
            });

            it("should get tickets after loading tickets and add a new ticket", function (done) {

                    vpos.locations.load().then(function(jsonLocs){
                        expect(jsonLocs).to.be.ok.and.an('array');

                        var location = vpos.locations.getAt(0);
                        expect(location).to.be.an('object');

                        location.load().then(function(jsonLoc){
                            expect(jsonLoc).to.be.an('object');

                            location.tickets.load().then(function(jsonTickets){
                                expect(jsonTickets).to.be.ok.and.an('array');

                                var jsonNewTicket = {
                                    "employee": "MjikgioG",
                                    "order_type": "KxiAaip5",
                                    "revenue_center": "LdiqGibo",
                                    "table": "jLiyniEb",
                                    "guest_count": 1,
                                    "name": "test ticket",
                                    "auto_send": true
                                };

                                location.tickets.add(jsonNewTicket).then(function(id){
                                    expect(id).to.be.ok.and.a('string');

                                    done();

                                }, function(ret){expect.fail()}).catch(function(e){expect.fail()});
                            });
                        });
                    });
            });
    });

  });
})();