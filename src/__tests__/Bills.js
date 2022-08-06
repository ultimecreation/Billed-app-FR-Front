/**
 * @jest-environment jsdom
 */

import { getByText, screen, waitFor } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js"
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";
jest.mock("../app/Store", () => mockStore)

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        it("Then bill icon in vertical layout should be highlighted", async () => {

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId('icon-window'))
            const windowIcon = screen.getByTestId('icon-window')
            //to-do write expect expression
            expect(windowIcon.classList).toContain('active-icon')
        })
        test("Then bills should be ordered from earliest to latest", () => {

            document.body.innerHTML = BillsUI({ data: bills })
            // const dates = screen.test(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
            const dates = screen.getAllByTestId('bill-date').map(a => a.dataset.date)
            const orderByDateAsc = (a, b) => ((new Date(a) > new Date(b)) ? 1 : -1)
            const datesSorted = dates.sort(orderByDateAsc)
            expect(dates).toEqual(datesSorted)
        })

        test('Then i can click on new bill button', async () => {
            document.body.innerHTML = BillsUI({ data: { bills } })

            let pathname = ROUTES_PATH.Bills
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            const MyBills = new Bills({
                document, onNavigate, store: null, localStorage: window.localStorage
            })

            const btnNewBill = screen.getByTestId('btn-new-bill')
            expect(btnNewBill).toBeTruthy()

            const handleClickNewBill_1 = jest.fn(() => MyBills.handleClickNewBill())
            btnNewBill.addEventListener('click', handleClickNewBill_1)
            userEvent.click(btnNewBill)
            expect(handleClickNewBill_1).toHaveBeenCalled()
        })

        test('Then the eye icon can be clicked', async () => {

            document.body.innerHTML = BillsUI({ data: bills })

            let pathname = ROUTES_PATH.Bills
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            const MyBills = new Bills({
                document, onNavigate, store: null, localStorage: window.localStorage
            })


            const iconsEye = screen.getAllByTestId('icon-eye')
            expect(iconsEye).toBeTruthy()

            const iconEye = iconsEye[0]
            $.fn.modal = jest.fn();
            const handleClickIconEye_1 = jest.fn(MyBills.handleClickIconEye(iconEye))
            iconEye.addEventListener('click', handleClickIconEye_1)
            userEvent.click(iconEye)
            expect(handleClickIconEye_1).toHaveBeenCalled()
        })
    })
})

// test d'intégration GET
describe('Given I am a user connected as Employee', () => {

    describe("When I navigate to Bills page", () => {
        test('I can see my bills', async () => {
           
            document.body.innerHTML = BillsUI({ data: bills })

            let pathname = ROUTES_PATH.Bills
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            const MyBills = new Bills({
                document, onNavigate, store: null, localStorage: window.localStorage
            })

            const myBillsTitle = await screen.getByText('Mes notes de frais')
            expect(myBillsTitle).toBeTruthy()

            const acceptedBills = await screen.getAllByText('accepted')
            expect(acceptedBills).toBeTruthy()
            expect(acceptedBills).toHaveLength(1)

            const refusedBills = await screen.getAllByText('refused')
            expect(refusedBills).toBeTruthy()
            expect(refusedBills).toHaveLength(2)

            const pendingBills = await screen.getAllByText('pending')
            expect(pendingBills).toBeTruthy()
            expect(pendingBills).toHaveLength(1)
        })
    })
    describe("When an error occurs on API", () => {

        beforeEach(() => {
            jest.spyOn(mockStore, "bills")
            Object.defineProperty(
                window,
                'localStorage',
                { value: localStorageMock }
            )
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
                email: "a@a"
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.appendChild(root)
            router()
            
        })

        test("fetches bills from an API and fails with an error message", async () => {
          
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 404"))
                    }
                }
            })
             
            window.onNavigate(ROUTES_PATH.Bills)
            await new Promise(process.nextTick);
            const message = await screen.getByText(/Erreur 404/)
            expect(message).toBeTruthy()
           
        })

        test("fetches messages from an API and fails with an error message", async () => {

            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 500"))
                    }
                }
            })

            window.onNavigate(ROUTES_PATH.Bills)
            await new Promise(process.nextTick);
            const message = await screen.getByText(/Erreur 500/)
            
            expect(message).toBeTruthy()
        })
    })

})