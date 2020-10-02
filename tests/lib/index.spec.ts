// import { expect } from 'chai';
// import { Picker } from '../../lib/index';

// describe('Picker', () => {
//   it('should be a function', () => {
//     expect(Picker, 'should be a function').to.be.a('function');
//   });

//   describe('Get With No Json', () => {
//     let pckr = new Picker();
//     it('should return undefined when no json has been provided', () => {
//       expect(pckr.get('notfound')).to.be.undefined;
//     });

//     // TODO: Provide an accessor to the picker data.
//     // it('should have no json configured', () => {
//     //   expect(pckr.data).to.deep.equal([]);
//     // });

//     it('should explain why the result was undefined', () => {
//       expect(pckr.explain('notfound')).to.deep.equal({
//         path: 'notfound',
//         layer: '',
//         description: 'No json provided.',
//       });
//     });
//   });

//   describe('Get Primitive', () => {
//     let pckr = new Picker(
//       {
//         key01: 'val01',
//         key02: 'val02',
//       },
//       {
//         key02: 'val03',
//         key03: 'val04',
//       },
//       {
//         key04: 'val05',
//       },
//       {},
//       {
//         key05: 'val06',
//       },
//     );
//     it('should return correct value', () => {
//       expect(pckr.get('key01')).to.equal('val01');
//       expect(pckr.get('key02')).to.equal('val03');
//       expect(pckr.get('key03')).to.equal('val04');
//       expect(pckr.get('key04')).to.equal('val05');
//       expect(pckr.get('key05')).to.equal('val06');
//       // TODO: explain
//     });
//   });

//   describe('Get Object', () => {
//     it('should return an object value', () => {
//       let pckr = new Picker(
//         {
//           obj01: {
//             key01: 'val01',
//             key02: 'val02',
//           },
//         },
//         {
//           obj02: {
//             key01: 'val03',
//             key02: 'val04',
//           },
//         },
//       );
//       expect(pckr.get('obj01')).to.deep.equal({
//         key01: 'val01',
//         key02: 'val02',
//       });
//       expect(pckr.get('obj02')).to.deep.equal({
//         key01: 'val03',
//         key02: 'val04',
//       });
//       // TODO: explain
//     });

//     it(`should merge object properties when objects are named the same
//     and are at the same level`, () => {
//       let pckr = new Picker(
//         {
//           obj01: {
//             key01: 'val01',
//             key02: 'val02',
//           },
//         },
//         {
//           obj01: {
//             key02: 'val03',
//             key03: 'val04',
//           },
//         },
//       );
//       expect(pckr.get('obj01')).to.deep.equal({
//         key01: 'val01',
//         key02: 'val03',
//         key03: 'val04',
//       });
//       // TODO: explain
//     });
//   });

//   describe('Get Object With _shared', () => {
//     let pckrShared = new Picker({
//       _shared: {
//         key01: 'val00',
//         key04: 'val05',
//       },
//       obj01: {
//         key01: 'val01',
//         key02: 'val02',
//       },
//       obj02: {
//         key02: 'val03',
//         key03: 'val04',
//       },
//     });

//     it('should pull in property/values from the shared object', () => {
//       expect(pckrShared.get('obj01')).to.deep.equal({
//         key01: 'val01',
//         key02: 'val02',
//         key04: 'val05',
//       });

//       expect(pckrShared.get('obj02')).to.deep.equal({
//         key01: 'val00',
//         key02: 'val03',
//         key03: 'val04',
//         key04: 'val05',
//       });
//     });

//     xit('should merge _shared into all objects a the same level', () => {
//       expect(pckrShared.get('')).to.deep.equal({
//         obj01: {
//           key01: 'val01',
//           key02: 'val02',
//           key04: 'val05',
//         },
//         obj02: {
//           key01: 'val00',
//           key02: 'val03',
//           key03: 'val04',
//           key04: 'val05',
//         },
//       });
//     });
//   });
// });
