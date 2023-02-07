import { CallbackButton, CallbackButtonOption } from 'src/delivery/interfaces/telegram/telegram-component.interface'
import { TelegramMenuService } from 'src/usecase/crud/telegram/telegram-menu.service'
import { Markup } from 'telegraf'
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram'

export class ButtonComponent {
    /**
     * Function CallbackButtons to auto generate telegram callback button with fix row or dinamic row
     * @param values type of CallbackButton
     * @param option type of CallbackButtonOption with default value { row: 1, dinamic: false }
     * @returns InlineKeyboardButton[][]
     */

    static CallbackButtons(
        values: CallbackButton[],
        option: CallbackButtonOption = {}
    ): InlineKeyboardButton[][] {
        const { row = 1, dinamic = false, numbering = false, setLabel } = option
        const button: InlineKeyboardButton[][] = []
        const fixRow = row > 5 ? 5 : row
        const initLength = 40
        let maxLength = initLength

        for (let i = 0; i < values.length; i++) {
            const newValue = this.getButtonValue(values[i])
            const newLabel = this.getButtonLabel(values[i], { numbering, setLabel })
            const callbackBtn = Markup.button.callback(newLabel, newValue)

            if (i % fixRow === 0 && !dinamic) {
                button.push([callbackBtn])
            } else if ((maxLength <= newLabel.length || button.length === 0) && dinamic) {
                button.push([callbackBtn])
                maxLength = initLength - (newLabel.length + 2)
            } else if (maxLength > newLabel.length && button.length > 0 && dinamic) {
                button[button.length - 1].push(callbackBtn)
                maxLength = maxLength - (newLabel.length + 2)
            } else {
                button[Math.floor(i / fixRow)].push(callbackBtn)
            }
        }

        return button
    }

    private static getButtonValue(button: CallbackButton): string {
        const { value, action } = button
        return action ? JSON.stringify(TelegramMenuService.remapFullToShort({ value, action })) : value
    }

    private static getButtonLabel(
        button: CallbackButton,
        option: CallbackButtonOption
    ): string {

        const { label, number: num } = button
        const { setLabel, numbering } = option
        const newLabel = numbering && num ? `${num}. ${label}` : label
        const fixLabel = setLabel ? setLabel(newLabel) : newLabel

        return fixLabel
    }

}