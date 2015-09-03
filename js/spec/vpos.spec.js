(function () {
  "use strict";




    define(['chai', 'chaiAsPromised', 'vpos'], function (chai, chaiAsPromised, vpos) {
        var expect = chai.expect;
        chai.use(chaiAsPromised);

        beforeEach(function() {
            // injector = new Squire();
        });

        afterEach(function() {
            //injector.remove();
        });

        describe('chai test', function() {
            it('chai should works', function() {
                expect('a').to.equal('a');
            });

        });

        describe('vpos test', function () {

            it("should return an object", function () {
              //injector.require(['vpos'], function (vpos){
                  expect(vpos).to.be.ok;
              //});
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
                    console.log(2);
                    location.load().then(function(ret){
                        console.log(3);
                        expect(ret).to.be.an('object');
                        expect(ret).to.have.a.property('phone');

                        console.log(location.data);

                        var newPhone = "111.222.3333";
                        location.data['phone'] = newPhone;

                        console.log(4);

                        location.save().should.eventually.be.an('object')
                            .and.have.property('phone', newPhone);

                        console.log(5);
                        //reload the data from the server and see if newPhone number persisted
                        location.load().should.eventually.have.a.property('phone', newPhone);

                        console.log('done!');
                        done();


                    }, function(ret){expect.fail()}).catch(function(e){expect.fail()});

                }, function(e){expect.fail()}).catch(function(e){expect.fail();});

            });

            it("should get tickets after loading tickets and add a new ticket", function (done) {

                    vpos.locations.load().then(function(jsonLocs){
                        expect(jsonLocs).to.be.ok;
                        expect(jsonLocs.length).toBeGreaterThan(0);

                        var location = vpos.locations.getAt(0);
                        expect(location).toBeDefined();

                        location.load().then(function(jsonLoc){
                            expect(jsonLoc).toBeDefined();

                            location.tickets.load().then(function(jsonTickets){
                                expect(jsonTickets).toBeDefined();
                                expect(jsonTickets.length).toBeAtLeast(0);

                                var jsonNewTicket = {
                                    "employee": "999999",
                                    "order_type": "1",
                                    "revenue_center": "1",
                                    "table": "5",
                                    "guest_count": 1,
                                    "name": "MyTicket",
                                    "auto_send": true
                                };

                                location.tickets.add(jsonNewTicket).then(function(id){
                                    expect(id).toBeDefined();
                                    expect(id).toBeGreaterThan(0);
                                    done();
                                });
                            });
                        });
                    });
            });
    });

  });
})();