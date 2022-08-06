/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store"
jest.mock("../app/Store", () => mockStore)

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page ", () => {
        test("Then i should see Envoyer une note de frais title", () => {
            const html = NewBillUI()
            document.body.innerHTML = html
            //to-do write assertion
            expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()
        })

        test('Should allow only jpg/jpeg/png files upload', () => {
            document.body.innerHTML = NewBillUI()
            const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpeg'] 
            
            let pathname = ROUTES_PATH.NewBill
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
                email:'a@a'
            }))

            const MyNewBill = new NewBill({
                document, onNavigate, store: mockStore, localStorage: window.localStorage
            })
            const file = screen.getByTestId('file')
            fireEvent.change(file, {
                target: {
                    files: [
                        new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
                    ],
                },
            })

            expect(allowedFileTypes).toContain(file.files[0].type)

            const btnSendBill = screen.getByTestId('btn-send-bill')
            expect(btnSendBill).toBeTruthy()

            const handleChnageFile_1 = jest.fn((e) => MyNewBill.handleChangeFile(e))
            btnSendBill.addEventListener('click',handleChnageFile_1)
            userEvent.click(btnSendBill)
            expect(handleChnageFile_1).toHaveBeenCalled()            
        })

        test('Should allow reject non jpg/jpeg/png files upload', () => {
            document.body.innerHTML = NewBillUI()
            const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpeg'] 
            
            let pathname = ROUTES_PATH.NewBill
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
                email:'a@a'
            }))

            const MyNewBill = new NewBill({
                document, onNavigate, store: mockStore, localStorage: window.localStorage
            })
            const file = screen.getByTestId('file')
            fireEvent.change(file, {
                target: {
                    files: [
                        new File(['(⌐□_□)'], 'chucknorris.gif', { type: 'image/gif' })
                    ],
                },
            })

            expect(allowedFileTypes).not.toContain(file.files[0].type)

            const btnSendBill = screen.getByTestId('btn-send-bill')
            expect(btnSendBill).toBeTruthy()

            const handleChnageFile_1 = jest.fn((e) => MyNewBill.handleChangeFile(e))
            btnSendBill.addEventListener('click',handleChnageFile_1)
            userEvent.click(btnSendBill)
            expect(handleChnageFile_1).toHaveBeenCalled()
            expect(file.value).toBe('')
            
        })


        test('Then I fill in the form and submit it successfully', () => {
            document.body.innerHTML = NewBillUI()

            const expenseTypeInput = screen.getByTestId('expense-type')
            fireEvent.change(expenseTypeInput,{ target: {value: 'Transports'}})
            expect(expenseTypeInput.value).toBe('Transports')

            const expenseNameInput = screen.getByTestId('expense-name')
            fireEvent.change(expenseNameInput,{ target: {value: 'expense 1'}})
            expect(expenseNameInput.value).toBe('expense 1')

            const expenseDateInput = screen.getByTestId('datepicker')
            fireEvent.change(expenseDateInput,{ target: {value: '2004-04-04'}})
            expect(expenseDateInput.value).toBe('2004-04-04')

            const expenseAmountInput = screen.getByTestId('amount')
            fireEvent.change(expenseAmountInput,{ target: {value: '100'}})
            expect(expenseAmountInput.value).toBe('100')

            const expenseVatInput = screen.getByTestId('vat')
            fireEvent.change(expenseVatInput,{ target: {value: '20'}})
            expect(expenseVatInput.value).toBe('20')

            const expensePctInput = screen.getByTestId('pct')
            fireEvent.change(expensePctInput,{ target: {value: '20'}})
            expect(expensePctInput.value).toBe('20')

            const expenseCommentaryInput = screen.getByTestId('commentary')
            fireEvent.change(expenseCommentaryInput,{ target: {value: 'un commentaire'}})
            expect(expenseCommentaryInput.value).toBe('un commentaire')

            let pathname = ROUTES_PATH.NewBill
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
                email:'a@a'
            }))

            const MyNewBill = new NewBill({
                document, onNavigate, store: mockStore, localStorage: window.localStorage
            })

            const btnSendBill = screen.getByTestId('btn-send-bill')
            expect(btnSendBill).toBeTruthy()

            const handleSubmit_1 = jest.fn((e) => MyNewBill.handleSubmit)
            btnSendBill.addEventListener('click',handleSubmit_1)
            userEvent.click(btnSendBill)
            expect(handleSubmit_1).toHaveBeenCalled()
        })
    })
})
