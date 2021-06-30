/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { CaretRight, CaretLeft } from '@carbon/icons-react/next';
import Pagination from '../Pagination';
import Select from '../Select';
import SelectItem from '../SelectItem';
import { shallow, mount } from 'enzyme';
import { settings } from 'carbon-components';

const { prefix } = settings;

jest.useFakeTimers();

describe('Pagination', () => {
  describe('renders as expected', () => {
    const pagination = mount(
      <Pagination className="extra-class" pageSizes={[5, 10]} totalItems={50} />
    );

    describe('icons', () => {
      const iconTypes = [CaretLeft, CaretRight];
      const icons = pagination.findWhere((n) => iconTypes.includes(n.type()));

      it('should have 2 icons', () => {
        expect(icons.length).toEqual(2);
      });
    });

    describe('pagination container', () => {
      it('should render the expected classes', () => {
        expect(pagination.childAt(0).hasClass(`${prefix}--pagination`)).toBe(
          true
        );
        expect(pagination.childAt(0).hasClass('extra-class')).toBe(true);
      });
    });

    describe('pagination size container', () => {
      const left = pagination.find(`.${prefix}--pagination__left`);

      it('should render a left container', () => {
        expect(left.length).toBe(1);
      });

      it('should have a size dropdown', () => {
        const select = left.find(Select);
        const items = select.find(SelectItem);
        expect(select.length).toBe(1);
        expect(items.length).toBe(2);
        expect(items.at(0).props().value).toBe(5);
        expect(items.at(1).props().value).toBe(10);
      });

      it('should label the dropdown', () => {
        const label = left.find(`.${prefix}--pagination__text`).first();
        expect(label.text()).toBe('Items per page:');
      });

      it('should show the item range out of the total', () => {
        const label = left.find(`.${prefix}--pagination__text`).at(1);
        expect(label.text()).toBe('1–5 of 50 items');
      });

      describe('pagination size container when total pages unknown', () => {
        const pager = mount(
          <Pagination pageSizes={[5, 10]} pagesUnknown={true} />
        );
        const left = pager.find(`.${prefix}--pagination__left`);

        it('should render a left container', () => {
          expect(left.length).toBe(1);
        });

        it('should have a size dropdown', () => {
          const select = left.find(Select);
          const items = select.find(SelectItem);
          expect(select.length).toBe(1);
          expect(items.length).toBe(2);
          expect(items.at(0).props().value).toBe(5);
          expect(items.at(1).props().value).toBe(10);
        });

        it('should label the dropdown', () => {
          const label = left.find(`.${prefix}--pagination__text`).first();
          expect(label.text()).toBe('Items per page:');
        });

        it('should show the item range without the total', () => {
          const label = left.find(`.${prefix}--pagination__text`).at(1);
          expect(label.text()).toBe('1–5 items');
        });
      });

      describe('pagination sizing', () => {
        it('should respond to page size changes', () => {
          let actualPageSize;
          const handler = ({ pageSize }) => {
            actualPageSize = pageSize;
          };
          const pager = mount(
            <Pagination
              pageSizes={[5, 10]}
              totalItems={50}
              onChange={handler}
            />
          );
          expect(pager.state().pageSize).toBe(5);
          pager
            .find('select')
            .first()
            .simulate('change', { target: { value: 10 } });
          expect(actualPageSize).toBe(10);
          expect(pager.state().pageSize).toBe(10);

          // Text updates after change
          const labels = pager.find(`.${prefix}--pagination__text`);
          expect(labels.at(1).text()).toBe('1–10 of 50 items');
          expect(labels.at(2).text()).toBe('of 5 pages');
        });

        it('should reset the page when page size changes', () => {
          let actualPage;
          const handler = ({ page }) => {
            actualPage = page;
          };
          const pager = mount(
            <Pagination
              pageSizes={[5, 10]}
              totalItems={50}
              onChange={handler}
            />
          );
          pager.setState({ page: 2 });
          expect(pager.state().page).toBe(2);
          pager
            .find('select')
            .first()
            .simulate('change', { target: { value: 10 } });
          expect(actualPage).toBe(1);
          expect(pager.state().page).toBe(1);
        });

        it('should return to first page on changes to pageSizes', () => {
          const pager = mount(
            <Pagination pageSizes={[5, 10]} totalItems={50} />
          );
          pager.setState({ page: 2 });
          pager.setProps({ pageSizes: [3, 6] });
          expect(pager.state().page).toEqual(1);
        });

        it('should not return to first page on changes to pageSizes where current pageSize is in new list', () => {
          const pager = mount(
            <Pagination pageSizes={[5, 10]} pageSize={10} totalItems={50} />
          );
          pager.setState({ page: 2 });
          pager.setProps({ pageSizes: [5, 10, 20] });
          expect(pager.state().page).toEqual(2);
        });

        it('should return to first page on changes to pageSizes where current pageSize is not in new list', () => {
          const pager = mount(
            <Pagination pageSizes={[5, 10]} pageSize={10} totalItems={50} />
          );
          pager.setState({ page: 2 });
          pager.setProps({ pageSizes: [25, 50, 100] });
          expect(pager.state().page).toEqual(1);
        });

        it('should avoid returning to first page unless actual change in pageSizes is detected', () => {
          const pager = mount(
            <Pagination pageSizes={[5, 10]} totalItems={50} />
          );
          pager.setState({ page: 2 });
          pager.setProps({ pageSizes: [5, 10] });
          expect(pager.state().page).toEqual(2);
        });

        it('should default to pageSize if pageSize is provided', () => {
          const pager = mount(
            <Pagination pageSizes={[5, 10]} pageSize={10} totalItems={50} />
          );
          expect(pager.state().pageSize).toEqual(10);
        });

        it('should default to pageSize if on change to pageSize', () => {
          const pager = mount(
            <Pagination pageSizes={[5, 10]} totalItems={50} />
          );
          pager.setProps({ pageSize: 10 });
          expect(pager.state().pageSize).toEqual(10);
        });

        it('should avoid defaulting to pageSize unless actual change in pageSize is detected', () => {
          const pager = mount(
            <Pagination pageSizes={[5, 10]} pageSize={10} totalItems={50} />
          );
          pager.setState({ pageSize: 20 });
          pager.setProps({ pageSize: 10 });
          expect(pager.state().pageSize).toEqual(20);
        });
      });
    });

    describe('pagination paging container', () => {
      const right = pagination.find(`.${prefix}--pagination__right`);

      it('should render a right container', () => {
        expect(right.length).toBe(1);
      });

      it('should show the current page out of the total number of pages', () => {
        const label = right.find(`.${prefix}--pagination__text`).first();
        expect(label.text()).toBe('of 10 pages');
      });

      it('should render ranges and pages for no items', () => {
        const pager = mount(<Pagination pageSizes={[5, 10]} totalItems={0} />);
        const labels = pager.find(`.${prefix}--pagination__text`);
        expect(labels.at(1).text()).toBe('0–0 of 0 items');
        expect(labels.at(2).text()).toBe('of 1 page');
      });

      it('should have two buttons for navigation', () => {
        const buttons = right
          .find(`.${prefix}--pagination__button`)
          .hostNodes();
        expect(buttons.length).toBe(2);
        expect(
          buttons.at(0).hasClass(`${prefix}--pagination__button--backward`)
        ).toBe(true);
        expect(
          buttons.at(1).hasClass(`${prefix}--pagination__button--forward`)
        ).toBe(true);
      });

      it('should disable backward navigation for the first page', () => {
        const buttons = right
          .find(`.${prefix}--pagination__button`)
          .hostNodes();
        expect(buttons.at(0).props().disabled).toBe(true);
        expect(buttons.at(1).props().disabled).toBe(false);
      });

      it('should disable forward navigation for the last page', () => {
        const smallPage = shallow(
          <Pagination
            className="extra-class"
            pageSizes={[100]}
            totalItems={50}
          />
        );
        const buttons = smallPage.find(`.${prefix}--pagination__button`);
        expect(buttons.at(0).props().disabled).toBe(true);
        expect(buttons.at(1).props().disabled).toBe(true);
      });

      describe('pagination paging container when total pages unknown', () => {
        const pager = mount(
          <Pagination pageSizes={[5, 10]} pagesUnknown={true} />
        );

        const right = pager.find(`.${prefix}--pagination__right`);

        it('should render a right container', () => {
          expect(right.length).toBe(1);
        });

        it('should show the current page without the total number of pages', () => {
          const label = right.find(`.${prefix}--pagination__text`).first();
          expect(label.text()).toBe('page 1');
        });

        it('should have two buttons for navigation', () => {
          const buttons = right
            .find(`.${prefix}--pagination__button`)
            .hostNodes();
          expect(buttons.length).toBe(2);
          expect(
            buttons.at(0).hasClass(`${prefix}--pagination__button--backward`)
          ).toBe(true);
          expect(
            buttons.at(1).hasClass(`${prefix}--pagination__button--forward`)
          ).toBe(true);
        });

        it('should disable backward navigation for the first page', () => {
          const buttons = right
            .find(`.${prefix}--pagination__button`)
            .hostNodes();
          expect(buttons.at(0).props().disabled).toBe(true);
          expect(buttons.at(1).props().disabled).toBe(false);
        });

        it('should disable forward navigation for the last page', () => {
          const smallPage = shallow(
            <Pagination
              pageSizes={[100]}
              pagesUnknown={true}
              isLastPage={true}
            />
          );
          const buttons = smallPage.find(`.${prefix}--pagination__button`);
          expect(buttons.at(0).props().disabled).toBe(true);
          expect(buttons.at(1).props().disabled).toBe(true);
        });

        it('should hide text input if disabled', () => {
          const noTextInput = shallow(
            <Pagination pageSizes={[100]} pagesUnknown={true} disabled={true} />
          );
          const right = noTextInput.find(
            `.${prefix}--pagination__right .${prefix}--text__input`
          );
          expect(right.length).toEqual(0);
        });

        it('should append `pagination__button--no-index` class if input is disabled', () => {
          const pagination = shallow(
            <Pagination
              page={2}
              pageSizes={[100]}
              pagesUnknown={true}
              disabled={true}
            />
          );
          const forwardButton = pagination.find(
            `.${prefix}--pagination__button--forward`
          );
          const backwardButton = pagination.find(
            `.${prefix}--pagination__button--backward`
          );
          expect(
            backwardButton.hasClass(`${prefix}--pagination__button--no-index`)
          ).toEqual(true);
          expect(
            forwardButton.hasClass(`${prefix}--pagination__button--no-index`)
          ).toEqual(true);
        });
      });

      describe('pagination navigation', () => {
        it('should go to the next page when clicking forward', () => {
          let actualPage;
          const handler = ({ page }) => {
            actualPage = page;
          };
          const pager = mount(
            <Pagination
              pageSizes={[5, 10]}
              totalItems={50}
              onChange={handler}
            />
          );
          expect(pager.state().page).toBe(1);
          pager
            .find(`.${prefix}--pagination__button--forward`)
            .hostNodes()
            .simulate('click');
          expect(actualPage).toBe(2);
          expect(pager.state().page).toBe(2);
        });

        it('should go to the previous page when clicking backward', () => {
          let actualPage;
          const handler = ({ page }) => {
            actualPage = page;
          };
          const pager = mount(
            <Pagination
              pageSizes={[5, 10]}
              totalItems={50}
              onChange={handler}
            />
          );
          pager.setState({ page: 2 });
          expect(pager.state().page).toBe(2);
          pager
            .find(`.${prefix}--pagination__button--backward`)
            .hostNodes()
            .simulate('click');
          expect(actualPage).toBe(1);
          expect(pager.state().page).toBe(1);
        });

        it('should jump to the page entered in the input field', () => {
          let actualPage;
          const handler = ({ page }) => {
            actualPage = page;
          };
          const pager = mount(
            <Pagination
              pageSizes={[5, 10]}
              totalItems={50}
              onChange={handler}
            />
          );
          expect(pager.state().page).toBe(1);
          pager
            .find('select')
            .last()
            .simulate('change', { target: { value: 2 } });
          jest.runAllTimers();
          expect(actualPage).toBe(2);
          expect(pager.state().page).toBe(2);
        });

        it('should jump to page number if prop page is provided', () => {
          const pager = mount(
            <Pagination pageSizes={[5, 10]} totalItems={50} page={3} />
          );
          expect(pager.state().page).toBe(3);
          pager.setProps({ page: 2 });
          expect(pager.state().page).toBe(2);
        });

        it('should avoid jumping to page number unless actual change in prop page is detected', () => {
          const pager = mount(
            <Pagination pageSizes={[5, 10]} totalItems={50} page={3} />
          );
          expect(pager.state().page).toBe(3);
          pager.setState({ page: 2 });
          pager.setProps({ page: 3 });
          expect(pager.state().page).toBe(2);
        });

        it('should not increment page if there is only 1 page', () => {
          const pager = mount(<Pagination pageSizes={[10]} totalItems={5} />);
          const buttons = pager.find(`.${prefix}--pagination__button`);
          expect(buttons.at(1).props().disabled).toBe(true);
        });
      });
    });
  });
});
